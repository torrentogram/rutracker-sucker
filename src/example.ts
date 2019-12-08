import { RutrackerSucker } from './sucker';
import { clusterizeResults } from './clusterizeResults';
import { config as dotenvConfig } from 'dotenv';
import { rankResults } from './rankResults';

async function main() {
    dotenvConfig();
    const sucker = new RutrackerSucker(
        process.env.LOGIN || '',
        process.env.PASSWORD || ''
    );
    console.log('---- Authenticating');
    await sucker.authenticate();

    console.log('---- Searching');
    const items = await sucker.search('побег из шоушенка');
    const clusters = clusterizeResults(items, 'seeds');
    console.log(
        'Cluster sizes:',
        clusters.map(c => c.length)
    );
    const popularCluster = clusters[0];
    console.log(popularCluster);
    console.log('---- Loading topics');
    const topics = await sucker.getTopics(
        popularCluster.map(result => result.topicId)
    );
    const rankedResults = rankResults(popularCluster, topics);
    console.log(rankedResults);
}

main().catch(e => {
    console.error(e.stack || e);
    process.exit(1);
});
