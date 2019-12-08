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
                topicUrl: null,
            },
            {
                title: 'big',
                seeds: 170,
                forumName: '',
                size: 0,
                topicId: 0,
                topicUrl: null,
            },
            {
                title: 'tiny',
                seeds: 1,
                forumName: '',
                size: 0,
                topicId: 0,
                topicUrl: null,
            },
            {
                title: 'huge',
                seeds: 200,
                forumName: '',
                size: 0,
                topicId: 0,
                topicUrl: null,
            },
            {
                title: 'not big',
                seeds: 5,
                forumName: '',
                size: 0,
                topicId: 0,
                topicUrl: null,
            },
            {
                title: 'average',
                seeds: 12,
                forumName: '',
                size: 0,
                topicId: 0,
                topicUrl: null,
            },
        ];

        const clusterized = clusterizeResults(searchResults, 'seeds');
        expect(clusterized).toMatchInlineSnapshot(`
            Array [
              Array [
                Object {
                  "forumName": "",
                  "seeds": 200,
                  "size": 0,
                  "title": "huge",
                  "topicId": 0,
                  "topicUrl": null,
                },
                Object {
                  "forumName": "",
                  "seeds": 170,
                  "size": 0,
                  "title": "big",
                  "topicId": 0,
                  "topicUrl": null,
                },
              ],
              Array [
                Object {
                  "forumName": "",
                  "seeds": 12,
                  "size": 0,
                  "title": "average",
                  "topicId": 0,
                  "topicUrl": null,
                },
                Object {
                  "forumName": "",
                  "seeds": 5,
                  "size": 0,
                  "title": "not big",
                  "topicId": 0,
                  "topicUrl": null,
                },
                Object {
                  "forumName": "",
                  "seeds": 2,
                  "size": 0,
                  "title": "small",
                  "topicId": 0,
                  "topicUrl": null,
                },
                Object {
                  "forumName": "",
                  "seeds": 1,
                  "size": 0,
                  "title": "tiny",
                  "topicId": 0,
                  "topicUrl": null,
                },
              ],
            ]
        `);
    });
});
