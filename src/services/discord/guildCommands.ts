import discordRequest from "./discordRequest";
import { APP_ID, GUILD_ID } from "./env";
import { ApplicationCommand } from "./types";

export async function getGuildCommands(
  appId = process.env.D_APPLICATION_ID,
  guildId = process.env.D_GUILD_ID
) {
  const endpoint = `applications/${appId}/guilds/${guildId}/commands`;
  const res = await discordRequest(endpoint, { method: "GET" });
  return res.data;
}

export async function createGuildCommand(
  command: ApplicationCommand,
  appId = APP_ID,
  guildId = GUILD_ID
) {
  const guildEndpoint = `applications/${appId}/guilds/${guildId}/commands`;

  const res = await discordRequest(guildEndpoint, {
    method: "post",
    data: command,
  });

  return res.data;
}
