import 'dotenv/config';
import express from 'express';
import router from './router';
import { logger } from './middleware/logger';
import { INIT } from './services/discord/commands/init';
import { migrateGlobalComands } from './services/discord/migrateGlobalCommands';

const app = express();
app.use(logger);
app.use(router);

app.listen(3000, () => {
    console.log('Listening on port 3000');
    console.log(process.env.DATABASE_URL);
    migrateGlobalComands([INIT]);
});
