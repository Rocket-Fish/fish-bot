import { InteractionType, InteractionResponseType } from 'discord-interactions';
import { Request, Response } from 'express';
import { populateGuild } from '../middleware/populateGuild';
import { handleInit, init } from '../services/discord/commands/init';
import { handleRoleCommand, role } from '../services/discord/commands/role';
import { handleTest, test } from '../services/discord/commands/test';
import { handleDeleteRoleSelection, makeDeleteRoleConfigMenu } from '../services/discord/components/delete-role-config-menu';
import { respondWithMessageInEmbed, Status } from '../services/discord/respondToInteraction';

export async function handleInteractions(req: Request, res: Response) {
    try {
        // Interaction type and data
        const { type, data } = req.body;
        const app = req.app;
        app.locals.fflogsToken;

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
                case init.name:
                    return await handleInit(req, res);
                case test.name:
                    return await handleTest(req, res);
                case role.name:
                    [req, res] = await populateGuild(req, res);
                    return await handleRoleCommand(req, res);
                default:
                    return res.send({
                        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                        data: { content: 'Command not supported' },
                    });
            }
        }

        if (type === InteractionType.MESSAGE_COMPONENT) {
            switch (data.custom_id) {
                case makeDeleteRoleConfigMenu([]).custom_id:
                    return await handleDeleteRoleSelection(req, res);
                default:
                    return res.send({
                        type: InteractionResponseType.UPDATE_MESSAGE,
                        data: {
                            content: 'Component not supported',
                            components: [],
                        },
                    });
            }
        }
    } catch (err) {
        if (err instanceof Error) res.send(respondWithMessageInEmbed(err.name, `${err.message}`, Status.failure));
        else res.send(respondWithMessageInEmbed('Failure', 'An unknown error has occured', Status.failure));
    }
}
