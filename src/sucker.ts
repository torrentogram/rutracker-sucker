import axios, { AxiosInstance, AxiosResponse } from 'axios';
import axiosCookieJarSupport from 'axios-cookiejar-support';
import cheerio from 'cheerio';
import { parse as parseContentDisposition } from 'content-disposition';
import ExtendableError from 'es6-error';
import { fromString as htmlFromString } from 'html-to-text';
import iconv from 'iconv-lite';
import { dirname, resolve } from 'path';
import qs from 'qs';
import { CookieJar } from 'tough-cookie';
import { Authenticatable } from './Authenticatable';
import { authenticated } from './authenticated';
import { cached } from './cache';

export interface SearchResult {
    title: string;
    topicId: number;
    topicUrl: string | null;
    forumName: string;
    seeds: number;
    size: number;
}

export interface Topic {
    body: Cheerio;
    bodyText: string;
}

export interface Torrent {
    data: Buffer;
    filename: string;
}

export class AuthenticationError extends ExtendableError {
    message = 'Authentication Error';
}

export class RutrackerSucker implements Authenticatable {
    private baseURL: string = 'https://rutracker.org';
    private http: AxiosInstance;
    private cookieJar: CookieJar;
    public lastAuthenticationTime: number = 0;

    constructor(
        private readonly login: string,
        private readonly password: string
    ) {
        this.cookieJar = new CookieJar();
        this.http = axios.create({
            baseURL: this.baseURL,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Accept:
                    'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
                Referer: this.baseURL,
                Origin: this.baseURL,
                'User-Agent':
                    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/78.0.3904.97 Chrome/78.0.3904.97 Safari/537.36',
            },
        });
        axiosCookieJarSupport(this.http);
    }

    private parseLoggedInUser(responseUtf: string): string {
        const $ = cheerio.load(responseUtf);
        const usernameText = $('#logged-in-username').text();
        return usernameText;
    }

    async isAuthenticated(): Promise<boolean> {
        const body = this.toUTF8(
            await this.http.get('/forum/index.php', {
                jar: this.cookieJar,
                withCredentials: true,
                responseType: 'arraybuffer',
            })
        );
        return !!this.parseLoggedInUser(body);
    }

    async authenticate(): Promise<void> {
        const body = this.toUTF8(
            await this.http.post(
                '/forum/login.php',
                qs.stringify({
                    redirect: 'index.php',
                    login_username: this.login,
                    login_password: this.password,
                    login: 'Login',
                }),
                {
                    jar: this.cookieJar,
                    withCredentials: true,
                    responseType: 'arraybuffer',
                }
            )
        );
        if (!this.parseLoggedInUser(body)) {
            throw new AuthenticationError();
        }
    }

    @authenticated({ ttl: 20 * 60 * 1000 })
    @cached({ ttl: 60 * 60 * 1000 })
    async search(q: string): Promise<SearchResult[]> {
        const body = this.toUTF8(
            await this.http.get(
                `/forum/tracker.php?${qs.stringify({ nm: q })}`,
                {
                    jar: this.cookieJar,
                    withCredentials: true,
                    responseType: 'arraybuffer',
                }
            )
        );

        const $ = cheerio.load(body);
        const items = $('tr.hl-tr')
            .toArray()
            .map(tr => {
                const item = this.parseTableRowToSearchResult($(tr));
                return item;
            });
        return items;
    }

    @authenticated({ ttl: 20 * 60 * 1000 })
    @cached({ ttl: 60 * 60 * 1000 })
    async searchByUserId(uid: number): Promise<SearchResult[]> {
        const parseResults = (
            baseURL: string,
            body: string
        ): { items: SearchResult[]; nextURL: string | null } => {
            const $ = cheerio.load(body);
            const items = $('tr.hl-tr')
                .toArray()
                .map(tr => {
                    const item = this.parseTableRowToSearchResult($(tr));
                    return item;
                });

            const pagerLinks = $('a.pg');
            const link = Array.from(pagerLinks).find(
                el =>
                    $(el)
                        .text()
                        .trim() === 'След.'
            );
            const nextURL = link
                ? resolve(dirname(baseURL), $(link).attr('href'))
                : null;

            return { items, nextURL };
        };

        const get = async (url: string): Promise<string> =>
            this.toUTF8(
                await this.http.get(url, {
                    jar: this.cookieJar,
                    withCredentials: true,
                    responseType: 'arraybuffer',
                })
            );

        //--------

        let url: string | null = `/forum/tracker.php?${qs.stringify({
            pid: uid,
        })}`;
        let items: SearchResult[] = [];
        while (url) {
            const body = await get(url);
            const results = parseResults(url, body);
            url = results.nextURL;
            items = items.concat(results.items);
        }

        return items;
    }

    @cached({ ttl: 60 * 60 * 1000 })
    private async getTopicHtml(topicId: number): Promise<string> {
        const url = `${this.baseURL}/forum/viewtopic.php?t=${topicId}`;
        return this.toUTF8(
            await this.http.get(url, {
                responseType: 'arraybuffer',
            })
        );
    }

    @authenticated({ ttl: 20 * 60 * 1000 })
    async getTopic(topicId: number): Promise<Topic> {
        const $ = cheerio.load(await this.getTopicHtml(topicId));
        const body = $($('.post_body').get(0));
        return {
            body,
            bodyText: htmlFromString(body.html() || ''),
        };
    }

    @authenticated({ ttl: 20 * 60 * 1000 })
    async getTopics(topicIds: number[]): Promise<Map<number, Topic>> {
        const topics = await Promise.all(
            topicIds.map(topicId => this.getTopic(topicId))
        );
        return topicIds.reduce(
            (m, topicId, index) => (m.set(topicId, topics[index]), m),
            new Map()
        );
    }

    @authenticated({ ttl: 20 * 60 * 1000 })
    @cached({ ttl: 60 * 60 * 1000 })
    async getTorrentFile(topicId: number): Promise<Torrent> {
        const url = `${this.baseURL}/forum/dl.php?${qs.stringify({
            t: topicId,
        })}`;

        const responseRaw = await this.http.get(url, {
            jar: this.cookieJar,
            withCredentials: true,
            responseType: 'arraybuffer',
        });

        const {
            data,
            headers: { 'content-disposition': condis },
        } = responseRaw;
        const {
            parameters: { filename = 'untitled.torrent' },
        } = parseContentDisposition(condis);

        return { data, filename };
    }
    private toUTF8(resp: AxiosResponse) {
        return iconv.decode(resp.data, 'cp1251');
    }
    private parseTableRowToSearchResult($tr: Cheerio): SearchResult {
        const item: SearchResult = {
            title: $tr
                .children('td.t-title-col')
                .text()
                .trim(),
            topicUrl:
                this.baseURL +
                '/forum/' +
                ($tr
                    .children('td.t-title-col')
                    .find('a[data-topic_id]')
                    .attr('href') || null),
            topicId: parseInt(
                (
                    $tr
                        .children('td.t-title-col')
                        .find('a[data-topic_id]')
                        .attr('data-topic_id') || ''
                ).trim(),
                10
            ),
            forumName: $tr
                .children('td.f-name-col')
                .text()
                .trim(),
            size: parseInt(
                (
                    $tr.children('td[data-ts_text]').attr('data-ts_text') || ''
                ).trim(),
                10
            ),
            seeds:
                parseInt(
                    $tr
                        .find('td.nowrap b.seedmed')
                        .text()
                        .trim(),
                    10
                ) || 0,
        };
        return item;
    }
}
