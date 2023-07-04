import { APPLICATION_ID } from './env';
import requestToDiscord from './requestToDiscordAPI';
import { InteractionResponseMessage } from './respondToInteraction';

/**
 *
 * @throws Error
 */
export async function performFollowup(interactionToken: string, data?: InteractionResponseMessage, appId = APPLICATION_ID) {
    const endpoint = `webhooks/${appId}/${interactionToken}`;
    return requestToDiscord(endpoint, {
        method: 'post',
        data,
    });
}

export default performFollowup;
