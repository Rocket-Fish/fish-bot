import { InteractionType, InteractionResponseType } from 'discord-interactions';
import { Request, Response } from 'express';
import { populateGuild } from '../middleware/populateGuild';
import { forEachMember, handleForEachMember } from '../services/discord/commands/for-each-member-in-server';
import { handleInit, init } from '../services/discord/commands/init';
import { handleRoleCommand, role } from '../services/discord/commands/role';
import { handleGroupCommand, group } from '../services/discord/commands/group';
import { handleTest, test } from '../services/discord/commands/test';
import { AddRole2GroupProperties, addRole2GroupMenu } from '../services/discord/components/add-role-to-group-menu';
import { handleDeleteRoleSelection, makeDeleteRoleConfigMenu } from '../services/discord/components/delete-role-config-menu';
import { handleDeleteGroupSelection, makeDeleteGroupMenu } from '../services/discord/components/delete-role-group-menu';
import {
    RefreshButtonTypes,
    handleRefreshForEachMember,
    handleRefreshGimmeRoles,
    makeRefreshButton,
} from '../services/discord/components/refresh-button';
import { respondWithMessageInEmbed, Status } from '../services/discord/respondToInteraction';
import { HTTPError } from '../services/http';
import { makeRemoveRoleFromGroupMenu, handleRemoveRoleFromGroupMenu } from '../services/discord/components/remove-role-from-group-menu';
import {
    CreateFFlogsRoleInitProperties,
    CreateFFlogsRole4ZoneProperties,
    createFflogsRole4Zone,
    createFflogsRoleInit,
    CreateFFlogsRole4EncounterProperties,
    createFFlogsRole4Encounter,
} from '../services/discord/components/create-fflogs-role';
import { CreateGroupProperties, EditGroupProperties, createGroupMenu, editGroupMenu } from '../services/discord/components/group-menu';
import {
    handleForEachMemberInServerUpdateRolesSelection,
    makeForEachMemberInServerUpdateRolesMenu,
} from '../services/discord/components/for-each-member-in-server-update-roles-menu';
import { gimmeRoles, handleGimmeRoles } from '../services/discord/commands/gimme-roles';
import { handleGimmeRoleSelection, makeGimmeRoleMenu } from '../services/discord/components/gimme-role-menu';

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
                case group.name:
                    [req, res] = await populateGuild(req, res);
                    return await handleGroupCommand(req, res);
                case forEachMember.name:
                    [req, res] = await populateGuild(req, res);
                    return await handleForEachMember(req, res);
                case gimmeRoles.name:
                    [req, res] = await populateGuild(req, res);
                    return await handleGimmeRoles(req, res);
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
                case makeDeleteGroupMenu([]).custom_id:
                    return await handleDeleteGroupSelection(req, res);
                case RefreshButtonTypes.refreshForEachMember:
                    [req, res] = await populateGuild(req, res);
                    return await handleRefreshForEachMember(req, res);
                case RefreshButtonTypes.refreshGimmeRoles:
                    [req, res] = await populateGuild(req, res);
                    return await handleRefreshGimmeRoles(req, res);
                case AddRole2GroupProperties.roleMenu:
                case AddRole2GroupProperties.groupMenu:
                    return await addRole2GroupMenu.handler(req, res);
                case makeRemoveRoleFromGroupMenu([]).custom_id:
                    return await handleRemoveRoleFromGroupMenu(req, res);
                case CreateFFlogsRoleInitProperties.type:
                    [req, res] = await populateGuild(req, res);
                    return await createFflogsRoleInit.handler(req, res);
                case CreateFFlogsRole4ZoneProperties.selectCondition:
                case CreateFFlogsRole4ZoneProperties.selectOperand:
                case CreateFFlogsRole4ZoneProperties.selectZone:
                    [req, res] = await populateGuild(req, res);
                    return await createFflogsRole4Zone.handler(req, res);
                case CreateFFlogsRole4EncounterProperties.selectCondition:
                case CreateFFlogsRole4EncounterProperties.selectOperand:
                case CreateFFlogsRole4EncounterProperties.selectEncounter:
                    [req, res] = await populateGuild(req, res);
                    return await createFFlogsRole4Encounter.handler(req, res);
                case CreateGroupProperties.isPublic:
                case CreateGroupProperties.isOrdered:
                    [req, res] = await populateGuild(req, res);
                    return await createGroupMenu.handler(req, res);
                case EditGroupProperties.id:
                case EditGroupProperties.isPublic:
                case EditGroupProperties.isOrdered:
                case EditGroupProperties.saveButton:
                case EditGroupProperties.cancelButton:
                    [req, res] = await populateGuild(req, res);
                    return await editGroupMenu.handler(req, res);
                case makeForEachMemberInServerUpdateRolesMenu([]).custom_id:
                    [req, res] = await populateGuild(req, res);
                    return await handleForEachMemberInServerUpdateRolesSelection(req, res);
                case makeGimmeRoleMenu([]).custom_id:
                    [req, res] = await populateGuild(req, res);
                    return await handleGimmeRoleSelection(req, res);
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
        else if (err instanceof Error) res.send(respondWithMessageInEmbed(err.name || 'Error', `${err.message}`, Status.failure));
        else res.send(respondWithMessageInEmbed('Failure', 'An unknown error has occured', Status.failure));
    }
}
