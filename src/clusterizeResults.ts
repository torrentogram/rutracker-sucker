import _ from 'lodash';
const clustering = require('density-clustering');

import { SearchResult } from './sucker';

type Dict = { [key: string]: any };

const average = (field: string) => (items: Array<SearchResult>): number => {
    if (!items.length) {
        return 0;
    }
    return (
        items.reduce((sum, item) => {
            sum += (<Dict>item)[field];
            return sum;
        }, 0) / items.length
    );
};

export const clusterizeResults = (
    items: Array<SearchResult>,
    field: string
) => {
    const fieldDataset = items.map(item => [(<Dict>item)[field]]);
    const kmeans = new clustering.KMEANS();
    const clusters = kmeans.run(fieldDataset, Math.min(2, items.length));
    const orderedClusters = _(clusters)
        .map(
            indexCluster => <Array<SearchResult>>(<unknown>_(indexCluster)
                    .map((i: number) => items[i])
                    .orderBy([field], ['desc'])
                    .value())
        )
        .orderBy([average(field)], ['desc'])
        .value();
    return orderedClusters;
};
