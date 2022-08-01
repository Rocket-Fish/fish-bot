import discordRequest from './discordRequest';
import { APPLICATION_ID } from './env';
import { ApplicationCommand, ApplicationCommandResponse, ApplicationCommandWithMandatoryId } from './types';

export async function getGuildCommands(guildId: string, appId = process.env.D_APPLICATION_ID): Promise<ApplicationCommandResponse[]> {
    const endpoint = `applications/${appId}/guilds/${guildId}/commands`;
    const res = await discordRequest(endpoint, { method: 'GET' });
    return res.data;
}

export async function createGuildCommand(command: ApplicationCommand, guildId: string, appId = APPLICATION_ID): Promise<ApplicationCommandResponse> {
    const endpoint = `applications/${appId}/guilds/${guildId}/commands`;

    const res = await discordRequest(endpoint, {
        method: 'post',
        data: command,
    });

    return res.data;
}

export async function updateGuildCommand(
    command: ApplicationCommandWithMandatoryId,
    guildId: string,
    appId = APPLICATION_ID
): Promise<ApplicationCommandResponse> {
    const endpoint = `applications/${appId}/guilds/${guildId}/commands/${command.id}`;

    const res = await discordRequest(endpoint, {
        method: 'patch',
        data: command,
    });

    return res.data;
}

export async function deleteGuildCommand(commandId: string, guildId: string, appId = APPLICATION_ID) {
    const endpoint = `applications/${appId}/guilds/${guildId}/commands/${commandId}`;

    await discordRequest(endpoint, {
        method: 'delete',
    });
}
