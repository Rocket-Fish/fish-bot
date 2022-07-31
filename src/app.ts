import 'dotenv/config';
import express from 'express';
import router from './router';
import { logger } from './middleware/logger';
import { PING } from './services/discord/commands';
import { migrateGuildCommands } from './services/discord/migrateGuildCommands';

const app = express();
app.use(logger);
app.use(router);

app.listen(3000, () => {
    console.log('Listening on port 3000');
    migrateGuildCommands(process.env.D_DEFUALT_GUILD_ID || '', [PING]);
});
