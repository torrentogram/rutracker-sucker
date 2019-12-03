import { RutrackerSucker } from './sucker';
import { clusterizeResults } from './clusterize-results';
import { config as dotenvConfig } from 'dotenv';

async function main() {
    dotenvConfig();
    const sucker = new RutrackerSucker(
        process.env.LOGIN || '',
        process.env.PASSWORD || ''
    );
    await sucker.authenticate();
    console.log('Authenticated');
    const items = await sucker.search('звездные войны');
    console.log(clusterizeResults(items));
}

main().catch(e => {
    console.error(e.stack || e);
    process.exit(1);
});
