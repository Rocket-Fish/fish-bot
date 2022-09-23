import config from '../../knexfile';
import knex from 'knex';
import { NODE_ENV } from '../services/discord/env';
export default knex(config[NODE_ENV]);
