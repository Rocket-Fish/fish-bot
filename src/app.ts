import 'dotenv/config';
import express from 'express';
import router from './router';
import { logger } from './middleware/logger';
import { init } from './services/discord/commands/init';
import { migrateGlobalComands } from './services/discord/migrateGlobalCommands';
import { getAccessToken } from './services/fflogs/init';
import { DATABASE_URL, IS_DEVELOPMENT, PORT } from './services/discord/env';

if (IS_DEVELOPMENT) {
    console.warn('STARTING IN DEVELOPMENT MODE, make sure this is set to false in production or stuff may be inadvertently logged');
}

const app = express();

app.use(logger);
app.use(router);

// TODO: make this a cron job
// access token seems to be valid for 360 days
// also retry after a few seconds if it fails
getAccessToken()
    .then((accessToken: string) => {
        app.locals.fflogsToken = accessToken;
    })
    .catch((e: Error) => {
        console.log(e);
    });

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
    if (IS_DEVELOPMENT) {
        console.log(DATABASE_URL);
    }
    migrateGlobalComands([init]);
});
