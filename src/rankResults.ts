import { Topic, SearchResult } from './sucker';
import { parse as bytesParse } from 'bytes';
import _ from 'lodash';

interface Ranker {
    (topic: Topic, searchResult: SearchResult): number;
}

export interface RankedSearchResult extends SearchResult {
    rank: number;
}

const containsXvid: Ranker = (topic, searchResult) => {
    if (topic.bodyText.match(/\bxvid\b/gi)) {
        return 1;
    }
    return 0;
};

const size1400or700: Ranker = (topic, { size }) => {
    if (size >= bytesParse('1.4gb') && size <= bytesParse('1.5gb')) {
        return 1;
    }
    if (size >= bytesParse('650mb') && size <= bytesParse('800mb')) {
        return 1;
    }
    return 0;
};

const containsMkv: Ranker = (topic, searchResult) => {
    if (topic.bodyText.match(/\bmkv\b/gi)) {
        return -1;
    }
    return 0;
};

const rankers = [containsXvid, containsMkv, size1400or700];

export const rankResults = (
    items: Array<SearchResult>,
    topicsById: Map<number, Topic>
): Array<RankedSearchResult> =>
    _(items)
        .map(item => {
            const topic = topicsById.get(item.topicId);
            const rank = topic
                ? rankers.reduce(
                      (rank, ranker) => ((rank += ranker(topic, item)), rank),
                      0
                  )
                : 0;
            return { ...item, rank };
        })
        .orderBy(['rank'], ['desc'])
        .value();
