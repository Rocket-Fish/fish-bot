import type { Knex } from 'knex';
import { DATABASE_URL } from './src/services/discord/env';

// Update with your config settings.

const config: { [key: string]: Knex.Config } = {
    development: {
        client: 'pg',
        connection: DATABASE_URL,
        migrations: {
            tableName: 'knex_migrations',
            directory: __dirname + '/src/db/migrations',
        },
        seeds: {
            directory: __dirname + '/src/db/seeds',
        },
    },

    // production: {
    //     client: 'postgresql',
    //     connection: {
    //         database: 'my_db',
    //         user: 'username',
    //         password: 'password',
    //     },
    //     pool: {
    //         min: 2,
    //         max: 10,
    //     },
    //     migrations: {
    //         tableName: 'knex_migrations',
    //     },
    // },
};

export default config;
