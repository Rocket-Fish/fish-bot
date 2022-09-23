import { Router } from 'express';
import { handleInteractions } from '../controllers/interactions';
import { verifyDiscordRequest } from '../middleware/verifyDiscordRequest';
import { DISCORD_PUBLIC_KEY } from '../services/discord/env';

const interations = Router();

interations.use(verifyDiscordRequest(DISCORD_PUBLIC_KEY));
interations.post('/', handleInteractions);

export default interations;
