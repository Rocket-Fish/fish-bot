import { createClient } from 'redis';
const url = process.env.REDIS_URL;
const client = createClient({ url });
client.connect();
export default client;
