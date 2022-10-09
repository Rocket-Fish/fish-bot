import { createClient } from 'redis';
import { promisify } from 'util';
const url = process.env.REDIS_URL;
const client = createClient({ url });
client.connect();
export default client;
