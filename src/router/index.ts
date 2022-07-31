import { Router } from 'express';
import interactions from './interactions';

const router = Router();

router.use('/interactions', interactions);

export default router;
