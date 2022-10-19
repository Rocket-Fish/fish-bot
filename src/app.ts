import 'dotenv/config';
import express from 'express';
import router from './router';
import { logger } from './middleware/logger';
import { init } from './services/discord/commands/init';
import { migrateGlobalComands } from './services/discord/migrateGlobalCommands';
import { DATABASE_URL, IS_DEVELOPMENT, PORT } from './services/discord/env';

if (IS_DEVELOPMENT) {
    console.warn('STARTING IN DEVELOPMENT MODE, make sure this is set to false in production or stuff may be inadvertently logged');
}

const app = express();

app.use(logger);
app.use(router);

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
    if (IS_DEVELOPMENT) {
        console.log(DATABASE_URL);
    }
    migrateGlobalComands([init]);
});
