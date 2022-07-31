import "dotenv/config";
import express from "express";
import router from "./router";
import { logger } from "./middleware/logger";
import { initCommands } from "./services/discord/commands";

const app = express();
app.use(logger);
app.use(router);

app.listen(3000, () => {
  console.log("Listening on port 3000");
  initCommands();
});
