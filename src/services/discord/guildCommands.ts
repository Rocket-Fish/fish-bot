import discordRequest from './discordRequest';
import { APPLICATION_ID } from './env';
import { ApplicationCommand } from './types';

export async function getGuildCommands(
    guildId: string,
    appId = process.env.D_APPLICATION_ID
): Promise<ApplicationCommand[]> {
    const endpoint = `applications/${appId}/guilds/${guildId}/commands`;
    const res = await discordRequest(endpoint, { method: 'GET' });
    return res.data;
}

export async function createGuildCommand(
    command: ApplicationCommand,
    guildId: string,
    appId = APPLICATION_ID
): Promise<ApplicationCommand> {
    const guildEndpoint = `applications/${appId}/guilds/${guildId}/commands`;

    const res = await discordRequest(guildEndpoint, {
        method: 'post',
        data: command,
    });

    return res.data;
}
