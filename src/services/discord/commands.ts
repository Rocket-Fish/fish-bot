import { handleError } from "./discordRequest";
import { getGuildCommands } from "./guildCommands";
import { ApplicationCommand, ApplicationCommandTypes } from "./types";

export const TEST_COMMAND: ApplicationCommand = {
  name: "test",
  description: "Check if fish-bot is alive",
  type: ApplicationCommandTypes.CHAT_INPUT,
};

export async function initCommands() {
  const installedCommands = await getGuildCommands();
  console.log(installedCommands);
}
