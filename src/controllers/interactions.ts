import { InteractionType, InteractionResponseType } from 'discord-interactions';
import { Request, Response } from 'express';
import { CONFIGURE_ROLE_BY_ZONE, handleConfigureRoleByZone } from '../services/discord/commands/configure-role-by-zone';
import { handleInit, INIT } from '../services/discord/commands/init';
import { handleTest, TEST } from '../services/discord/commands/test';

export function handleInteractions(req: Request, res: Response) {
    // Interaction type and data
    const { type, data } = req.body;

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
        switch (data.name) {
            case TEST.name:
                return handleTest(req, res);
            case CONFIGURE_ROLE_BY_ZONE.name:
                return handleConfigureRoleByZone(req, res);
            case INIT.name:
                return handleInit(req, res);
            default:
                return res.send({
                    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                    data: { content: 'Command not supported' },
                });
        }
    }
}
