import { InteractionType, InteractionResponseType } from 'discord-interactions';
import { Request, Response } from 'express';
import { populateGuild } from '../middleware/populateGuild';
import { forEachMember, handleForEachMember } from '../services/discord/commands/for-each-member-in-server';
import { handleInit, init } from '../services/discord/commands/init';
import { handleRoleCommand, role } from '../services/discord/commands/role';
import { handleRoleGroupCommand, roleGroup } from '../services/discord/commands/role-group';
import { handleTest, test } from '../services/discord/commands/test';
import { handleAddRoleToGroup, makeAddRoleToGroupMenu2, makeAddRoleToGroupMenu1 } from '../services/discord/components/add-role-to-group-menu';
import { handleDeleteRoleSelection, makeDeleteRoleConfigMenu } from '../services/discord/components/delete-role-config-menu';
import { handleDeleteRoleGroupSelection, makeDeleteRoleGroupMenu } from '../services/discord/components/delete-role-group-menu';
import { handleRefreshStatus, makeRefreshButton } from '../services/discord/components/refresh-button';
import { respondWithMessageInEmbed, Status } from '../services/discord/respondToInteraction';
import { HTTPError } from '../services/http';

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
                case roleGroup.name:
                    [req, res] = await populateGuild(req, res);
                    return await handleRoleGroupCommand(req, res);
                case forEachMember.name:
                    [req, res] = await populateGuild(req, res);
                    return await handleForEachMember(req, res);
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
                case makeDeleteRoleGroupMenu([]).custom_id:
                    return await handleDeleteRoleGroupSelection(req, res);
                case makeRefreshButton().custom_id:
                    [req, res] = await populateGuild(req, res);
                    return await handleRefreshStatus(req, res);
                case makeAddRoleToGroupMenu2([]).custom_id:
                case makeAddRoleToGroupMenu1([]).custom_id:
                    return await handleAddRoleToGroup(req, res);
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
        if (err instanceof HTTPError) res.send(respondWithMessageInEmbed(err.name, `${err.message}\n\n${JSON.stringify(err.data)}`, Status.failure));
        else if (err instanceof Error) res.send(respondWithMessageInEmbed(err.name, `${err.message}`, Status.failure));
        else res.send(respondWithMessageInEmbed('Failure', 'An unknown error has occured', Status.failure));
    }
}
