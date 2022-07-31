import "dotenv/config";
import express from "express";
import router from "./routes";
import { logger } from "./middleware/logger";
import { createDiscordCommands } from "./utils/initDiscordCommands";

const app = express();
app.use(logger);
app.use(router);

app.listen(3000, () => {
  console.log("Listening on port 3000");
  createDiscordCommands();
});
