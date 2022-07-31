import { AxiosError } from "axios";
import discordRequest from "../services/discordRequest.service";
import util from "util";

export async function createDiscordCommands() {
  const appId = process.env.D_APPLICATION_ID;
  const guildId = process.env.D_GUILD_ID;

  /**
   * Globally-scoped slash commands (generally only recommended for production)
   * See https://discord.com/developers/docs/interactions/application-commands#create-global-application-command
   */
  // const globalEndpoint = `applications/${appId}/commands`;

  /**
   * Guild-scoped slash commands
   * See https://discord.com/developers/docs/interactions/application-commands#create-guild-application-command
   */
  const guildEndpoint = `applications/${appId}/guilds/${guildId}/commands`;
  const commandBody = {
    name: "test",
    description: "Just your average command",
    // chat command (see https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-types)
    type: 1,
  };

  try {
    // Send HTTP request with bot token
    const res = await discordRequest(guildEndpoint, {
      method: "post",
      data: commandBody,
    });
  } catch (err) {
    if (err instanceof AxiosError)
      console.error(
        "Error installing commands:",
        err.code,
        err.message,
        util.inspect(err.response?.data, {
          showHidden: true,
          depth: null,
          colors: true,
        })
      );
    else console.error(err);
  }
}
