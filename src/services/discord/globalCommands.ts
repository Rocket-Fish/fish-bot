import discordRequest from './discordRequest';
import { APPLICATION_ID } from './env';
import {
    ApplicationCommand,
    ApplicationCommandResponse,
    ApplicationCommandWithMandatoryId,
} from './types';

export async function getGlobalCommand(
    appId = APPLICATION_ID
): Promise<ApplicationCommandResponse[]> {
    const endpoint = `applications/${appId}/commands`;

    // Send HTTP request with bot token
    const res = await discordRequest(endpoint, {
        method: 'get',
    });

    return res.data;
}

export async function createGlobalCommand(
    command: ApplicationCommand,
    appId = APPLICATION_ID
): Promise<ApplicationCommandResponse> {
    const endpoint = `applications/${appId}/commands`;

    // Send HTTP request with bot token
    const res = await discordRequest(endpoint, {
        method: 'post',
        data: command,
    });

    return res.data;
}

export async function updateGlobalCommand(
    command: ApplicationCommandWithMandatoryId,
    appId = APPLICATION_ID
): Promise<ApplicationCommandResponse> {
    const endpoint = `applications/${appId}/commands/${command.id}`;

    const res = await discordRequest(endpoint, {
        method: 'patch',
        data: command,
    });

    return res.data;
}

export async function deleteGlobalCommand(
    commandId: string,
    appId = APPLICATION_ID
) {
    const endpoint = `applications/${appId}/commands/${commandId}`;

    await discordRequest(endpoint, {
        method: 'delete',
    });
}
