import _ from 'lodash';
import { config as dotenvConfig } from 'dotenv';
import { RutrackerSucker } from './sucker';

async function main() {
    dotenvConfig();
    const sucker = new RutrackerSucker(
        process.env.LOGIN || '',
        process.env.PASSWORD || ''
    );
    const items = await sucker.searchByUserId(13980964); //dalemake
    console.log(
        _(items)
            .orderBy(['seeds'], ['desc'])
            .value()
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
