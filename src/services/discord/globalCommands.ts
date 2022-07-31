import discordRequest from './discordRequest';
import { APPLICATION_ID } from './env';
import { ApplicationCommand } from './types';

export async function getGlobalCommand(
    appId = APPLICATION_ID
): Promise<ApplicationCommand[]> {
    const globalEndpoint = `applications/${appId}/commands`;

    // Send HTTP request with bot token
    const res = await discordRequest(globalEndpoint, {
        method: 'get',
    });

    return res.data;
}

export async function createGlobalCommand(
    command: ApplicationCommand,
    appId = APPLICATION_ID
): Promise<ApplicationCommand> {
    const globalEndpoint = `applications/${appId}/commands`;

    // Send HTTP request with bot token
    const res = await discordRequest(globalEndpoint, {
        method: 'post',
        data: command,
    });

    return res.data;
}
