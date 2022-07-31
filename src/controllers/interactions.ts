import { InteractionType, InteractionResponseType } from 'discord-interactions';
import { Request, Response } from 'express';
import { CONFIGURE_ROLE_BY_ZONE, TEST } from '../services/discord/commands';
import util from 'util';

export function handleInteractions(req: Request, res: Response) {
    // Interaction type and data
    const { type, data, id } = req.body;

    /**
     * Handle verification requests
     */
    if (type === InteractionType.PING) {
        return res.send({ type: InteractionResponseType.PONG });
    }

    /**
     * Handle slash command requests
     */
    if (type === InteractionType.APPLICATION_COMMAND) {
        // Slash command with name of "test"
        if (data.name === TEST.name) {
            // Send a message as response
            return res.send({
                type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                data: { content: 'I am alive' },
            });
        }
        if (data.name === CONFIGURE_ROLE_BY_ZONE.name) {
            console.log(
                util.inspect(data, {
                    showHidden: true,
                    depth: null,
                    colors: true,
                })
            );
            return res.send({
                type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                data: { content: 'TODO: configure role' },
            });
        }
    }
}
