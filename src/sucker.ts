import { parse as parseContentDisposition } from 'content-disposition';
import axios, { AxiosInstance } from 'axios';
import axiosCookieJarSupport from 'axios-cookiejar-support';
import iconv from 'iconv-lite';
import qs from 'qs';
import { CookieJar } from 'tough-cookie';
import cheerio from 'cheerio';
import ExtendableError from 'es6-error';
import { fromString as htmlFromString } from 'html-to-text';
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

export class RutrackerSucker {
    private baseURL: string = 'https://rutracker.org';
    private http: AxiosInstance;
    private cookieJar: CookieJar;

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
        const responseRaw = await this.http.get('/forum/index.php', {
            jar: this.cookieJar,
            withCredentials: true,
            responseType: 'arraybuffer',
        });
        const responseUtf = iconv.decode(responseRaw.data, 'cp1251');
        return !!this.parseLoggedInUser(responseUtf);
    }

    async authenticate(): Promise<void> {
        const responseRaw = await this.http.post(
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
        );
        const responseUtf = iconv.decode(responseRaw.data, 'cp1251');
        if (!this.parseLoggedInUser(responseUtf)) {
            throw new AuthenticationError();
        }
    }

    @cached({ ttl: 60 * 60 * 1000 })
    async search(q: string): Promise<Array<SearchResult>> {
        const responseRaw = await this.http.get(
            `/forum/tracker.php?${qs.stringify({ nm: q })}`,
            {
                jar: this.cookieJar,
                withCredentials: true,
                responseType: 'arraybuffer',
            }
        );
        const responseUtf = iconv.decode(responseRaw.data, 'cp1251');

        const $ = cheerio.load(responseUtf);
        const items = $('tr.hl-tr')
            .toArray()
            .map(tr => {
                const $tr = $(tr);
                const item: SearchResult = {
                    title: $tr
                        .children('td.t-title')
                        .text()
                        .trim(),
                    topicUrl:
                        this.baseURL +
                        '/forum/' +
                        ($tr
                            .children('td.t-title')
                            .find('a[data-topic_id]')
                            .attr('href') || null),
                    topicId: parseInt(
                        (
                            $tr
                                .children('td.t-title')
                                .find('a[data-topic_id]')
                                .attr('data-topic_id') || ''
                        ).trim(),
                        10
                    ),
                    forumName: $tr
                        .children('td.f-name')
                        .text()
                        .trim(),
                    size: parseInt(
                        (
                            $tr
                                .children('td[data-ts_text]')
                                .attr('data-ts_text') || ''
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
            });
        return items;
    }

    @cached({ ttl: 60 * 60 * 1000 })
    async getTopic(topicId: number): Promise<Topic> {
        const url = `${this.baseURL}/forum/viewtopic.php?t=${topicId}`;
        const responseRaw = await this.http.get(url, {
            responseType: 'arraybuffer',
        });
        const responseUtf = iconv.decode(responseRaw.data, 'cp1251');
        const $ = cheerio.load(responseUtf);
        const body = $($('.post_body').get(0));
        return {
            body,
            bodyText: htmlFromString(body.html() || ''),
        };
    }

    async getTopics(topicIds: Array<number>): Promise<Map<number, Topic>> {
        const topics = await Promise.all(
            topicIds.map(topicId => this.getTopic(topicId))
        );
        return topicIds.reduce(
            (m, topicId, index) => (m.set(topicId, topics[index]), m),
            new Map()
        );
    }

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
}
