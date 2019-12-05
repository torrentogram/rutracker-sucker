import { SearchResult } from './sucker';
import { clusterizeResults } from './clusterize-results';

describe('clusterizeResults', () => {
    it('should clusterize', () => {
        const searchResults: Array<SearchResult> = [
            {
                title: 'small',
                seeds: 2,
                forumName: '',
                size: 0,
                topicId: 0,
                topicUrl: null
            },
            {
                title: 'big',
                seeds: 23,
                forumName: '',
                size: 0,
                topicId: 0,
                topicUrl: null
            },
            {
                title: 'tiny',
                seeds: 1,
                forumName: '',
                size: 0,
                topicId: 0,
                topicUrl: null
            },
            {
                title: 'huge',
                seeds: 54,
                forumName: '',
                size: 0,
                topicId: 0,
                topicUrl: null
            },
            {
                title: 'not big',
                seeds: 5,
                forumName: '',
                size: 0,
                topicId: 0,
                topicUrl: null
            },
            {
                title: 'average',
                seeds: 12,
                forumName: '',
                size: 0,
                topicId: 0,
                topicUrl: null
            }
        ];

        const clusterBig = [
            {
                title: 'huge',
                seeds: 54,
                forumName: '',
                size: 0,
                topicId: 0,
                topicUrl: null
            },
            {
                title: 'big',
                seeds: 23,
                forumName: '',
                size: 0,
                topicId: 0,
                topicUrl: null
            }
        ];

        const clusterSmall = [
            {
                title: 'average',
                seeds: 12,
                forumName: '',
                size: 0,
                topicId: 0,
                topicUrl: null
            },
            {
                title: 'not big',
                seeds: 5,
                forumName: '',
                size: 0,
                topicId: 0,
                topicUrl: null
            },
            {
                title: 'small',
                seeds: 2,
                forumName: '',
                size: 0,
                topicId: 0,
                topicUrl: null
            },
            {
                title: 'tiny',
                seeds: 1,
                forumName: '',
                size: 0,
                topicId: 0,
                topicUrl: null
            }
        ];
        const clusterized = clusterizeResults(searchResults, 'seeds');
        expect(clusterized).toEqual([clusterBig, clusterSmall]);
    });
});
