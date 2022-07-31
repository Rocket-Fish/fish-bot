import discordRequest from "./discordRequest";
import { APP_ID } from "./env";
import { ApplicationCommand } from "./types";

export async function createGlobalCommand(
  command: ApplicationCommand,
  appId = APP_ID
) {
  const globalEndpoint = `applications/${appId}/commands`;

  // Send HTTP request with bot token
  const res = await discordRequest(globalEndpoint, {
    method: "post",
    data: command,
  });

  return res.data;
}
