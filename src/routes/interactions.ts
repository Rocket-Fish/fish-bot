import { Router } from "express";
import { handleInteractions } from "../controllers/interactions";
import { verifyDiscordRequest } from "../middleware/verifyDiscordRequest";

const router = Router();

router.use(verifyDiscordRequest(process.env.D_PUBLIC_KEY || ""));
router.post("/", handleInteractions);

export default router;
