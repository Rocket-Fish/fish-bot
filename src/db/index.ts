const environment = process.env.ENVIRONMENT || 'development';
import config from '../../knexfile';
import knex from 'knex';
export default knex(config[environment]);
