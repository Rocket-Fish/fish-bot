import config from '../../knexfile';
import knex from 'knex';
import { ENVIRONMENT } from '../services/discord/env';
export default knex(config[ENVIRONMENT]);
