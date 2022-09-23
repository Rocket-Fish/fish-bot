import requestToDiscord from './requestToDiscordAPI';
import { APPLICATION_ID, DISCORD_APPLICATION_ID } from './env';
import { ApplicationCommand, ApplicationCommandResponse, ApplicationCommandWithMandatoryId } from './types';

export async function getGuildCommands(guildId: string, appId = DISCORD_APPLICATION_ID): Promise<ApplicationCommandResponse[]> {
    const endpoint = `applications/${appId}/guilds/${guildId}/commands`;
    const res = await requestToDiscord(endpoint, { method: 'GET' });
    return res.data;
}

export async function createGuildCommand(command: ApplicationCommand, guildId: string, appId = APPLICATION_ID): Promise<ApplicationCommandResponse> {
    const endpoint = `applications/${appId}/guilds/${guildId}/commands`;

    const res = await requestToDiscord(endpoint, {
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

    const res = await requestToDiscord(endpoint, {
        method: 'patch',
        data: command,
    });

    return res.data;
}

export async function deleteGuildCommand(commandId: string, guildId: string, appId = APPLICATION_ID) {
    const endpoint = `applications/${appId}/guilds/${guildId}/commands/${commandId}`;

    await requestToDiscord(endpoint, {
        method: 'delete',
    });
}
