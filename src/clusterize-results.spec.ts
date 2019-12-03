import { SearchResult } from './sucker';
import { clusterizeResults } from './clusterize-results';

describe('a', () => {
    it('should clusterize', () => {
        const searchResults: Array<SearchResult> = [
            { title: 'small', seeds: 2, forumName: '', size: 0, topicId: 0 },
            { title: 'big', seeds: 23, forumName: '', size: 0, topicId: 0 },
            { title: 'tiny', seeds: 1, forumName: '', size: 0, topicId: 0 },
            { title: 'huge', seeds: 54, forumName: '', size: 0, topicId: 0 },
            { title: 'not big', seeds: 5, forumName: '', size: 0, topicId: 0 },
            { title: 'average', seeds: 12, forumName: '', size: 0, topicId: 0 }
        ];

        const clusterBig = [
            { title: 'huge', seeds: 54, forumName: '', size: 0, topicId: 0 },
            { title: 'big', seeds: 23, forumName: '', size: 0, topicId: 0 }
        ];

        const clusterSmall = [
            { title: 'average', seeds: 12, forumName: '', size: 0, topicId: 0 },
            { title: 'not big', seeds: 5, forumName: '', size: 0, topicId: 0 },
            { title: 'small', seeds: 2, forumName: '', size: 0, topicId: 0 },
            { title: 'tiny', seeds: 1, forumName: '', size: 0, topicId: 0 }
        ];

        expect(clusterizeResults(searchResults)).toEqual([
            clusterBig,
            clusterSmall
        ]);
    });
});
