import _ from 'lodash';
const clustering = require('density-clustering');

import { SearchResult } from './sucker';

const average = (items: Array<SearchResult>): number => {
    if (!items.length) {
        return 0;
    }
    return (
        items.reduce((sum, item) => {
            sum += item.seeds;
            return sum;
        }, 0) / items.length
    );
};

export const clusterizeResults = (items: Array<SearchResult>) => {
    const seedsDataset = items.map(item => [item.seeds]);
    const kmeans = new clustering.KMEANS();
    const clusters = kmeans.run(seedsDataset, 2);
    const orderedClusters = _(clusters)
        .map(
            indexCluster => <Array<SearchResult>>(<unknown>_(indexCluster)
                    .map((i: number) => items[i])
                    .orderBy(['seeds'], ['desc'])
                    .value())
        )
        .orderBy([average], ['desc'])
        .value();
    return orderedClusters;
};
