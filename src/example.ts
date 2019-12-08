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
    const items = await sucker.search('горькая луна');
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

    const bestResult = rankedResults[0];

    console.log('---- Loading torrent');
    const torrent = await sucker.getTorrentFile(bestResult.topicId);
    console.log('Torrent file name:', torrent.filename);
    console.log(
        'First 100 bytes of the torrent:',
        torrent.data.slice(0, 100).toString('ascii')
    );
}

main()
    .then(() => {
        process.exit(0);
    })
    .catch(e => {
        console.error(e.stack || e);
        process.exit(1);
    });
