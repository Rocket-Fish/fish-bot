import { Router } from 'express';
import { handleInteractions } from '../controllers/interactions';
import { verifyDiscordRequest } from '../middleware/verifyDiscordRequest';

const interations = Router();

interations.use(verifyDiscordRequest(process.env.D_PUBLIC_KEY || ''));
interations.post('/', handleInteractions);

export default interations;
1;
