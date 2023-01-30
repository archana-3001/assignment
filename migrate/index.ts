import {getClientWithKeyspace} from '../src/db';
import {KEYSPACE, MIGRATE} from '../cql/index';

async function main() {
    console.log('Bootstrapping database...');
    const client = getClientWithKeyspace();
    console.log('Creating keyspace...');
    await client.execute(KEYSPACE);
    console.log('Keyspace created');
    console.log('Migrating database...');
    for (const query of MIGRATE) {
        console.log(`query = ${query}`);
        await client.execute(query);
    }
    console.log('Database migrated');
    return client;
}

main().then((client) => client.shutdown());