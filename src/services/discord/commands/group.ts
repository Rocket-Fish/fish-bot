import { Request, Response } from 'express';
import { Guild } from '../../../models/Guild';
import { getGroupedRoles, getGrouplessRoles, getRoles } from '../../../models/Role';
import { createGroup, deleteAllGroupsForGuild, getGroups } from '../../../models/Group';
import { convertGroupListToSelectOptions, convertRoleListToSelectOptions } from '../../../utils/convert';
import { SelectOption, createActionRowComponent } from '../components';
import {
    AddRole2GroupMenuIds,
    AddRole2GroupMenuIdsToData,
    cacheUserSelection,
    makeAddRoleToGroupMenu1,
    makeAddRoleToGroupMenu2,
} from '../components/add-role-to-group-menu';
import { makeDeleteGroupMenu } from '../components/delete-role-group-menu';
import { getGuildRoles } from '../guilds';
import { respondWithInteractiveComponent, respondWithMessageInEmbed, Status } from '../respondToInteraction';
import { ApplicationCommand, ApplicationCommandOptionTypes, ApplicationCommandTypes } from '../types';
import { groupCustomize, groupNameInput } from './options/role-group-name-input';
import { role, RoleOptions } from './role';
import { ActionNotImplemented } from './types';
import { makeRemoveRoleFromGroupMenu } from '../components/remove-role-from-group-menu';
import {
    CreateGroupMenuIds,
    CreateGroupMenuIdsToData,
    cacheCreateGroupMenuUserSelection,
    makeCreateGroupMenu1,
    makeCreateGroupMenu2,
} from '../components/create-group-menu';

export enum GroupOptions {
    create = 'create',
    list = 'list',
    delete = 'delete',
    deleteAll = 'delete-all',
    addRole = 'add-role',
    removeRole = 'remove-role',
    orderRoles = 'order-roles', // TODO
}

export const group: ApplicationCommand = {
    name: 'group',
    description: 'Manage role groups; only one role per role group will be given to a member',
    type: ApplicationCommandTypes.CHAT_INPUT,
    options: [
        {
            name: GroupOptions.create,
            description: 'Create a role group',
            type: ApplicationCommandOptionTypes.SUB_COMMAND,
            options: [groupNameInput, groupCustomize],
        },
        {
            name: GroupOptions.list,
            description: 'Lists all role groups',
            type: ApplicationCommandOptionTypes.SUB_COMMAND,
        },
        {
            name: GroupOptions.delete,
            description: 'Delete a role group',
            type: ApplicationCommandOptionTypes.SUB_COMMAND,
        },
        {
            name: GroupOptions.deleteAll,
            description: 'Delete all role groups',
            type: ApplicationCommandOptionTypes.SUB_COMMAND,
        },
        {
            name: GroupOptions.addRole,
            description: 'Add a role to this a role group',
            type: ApplicationCommandOptionTypes.SUB_COMMAND,
        },
        {
            name: GroupOptions.removeRole,
            description: 'remove a role from its role group',
            type: ApplicationCommandOptionTypes.SUB_COMMAND,
        },
    ],
    default_member_permissions: '0', // default to disable for everyone except server admins
};

export async function handleGroupCommand(req: Request, res: Response) {
    const { data } = req.body;

    const option = data.options[0];
    switch (option.name) {
        case GroupOptions.create:
            return onCreate(req, res);
        case GroupOptions.list:
            return onList(req, res);
        case GroupOptions.delete:
            return onDelete(req, res);
        case GroupOptions.deleteAll:
            return onDeleteAll(req, res);
        case GroupOptions.addRole:
            return onAddRole(req, res);
        case GroupOptions.removeRole:
            return onRemoveRole(req, res);
        default:
            throw new ActionNotImplemented();
    }
}

async function onCreate(req: Request, res: Response) {
    const { data, id } = req.body;

    const guild: Guild = res.locals.guild;

    let name: string = data.options[0].options[0].value;
    name = name.replaceAll(/[^a-zA-Z0-9 -]/g, '');

    const customize: string | undefined = data.options[0].options?.[1]?.value;

    if (customize) {
        await initializeCreateCustomGroupCache(id, name);
        return res.send(
            respondWithInteractiveComponent('Select Options for Group', [
                createActionRowComponent([makeCreateGroupMenu1()]),
                createActionRowComponent([makeCreateGroupMenu2()]),
            ])
        );
    } else {
        await createGroup(guild.id, name);
        return res.send(respondWithMessageInEmbed(`Role-Group Created`, `name: ${name}\nType: Private Unordered`));
    }
}

async function initializeCreateCustomGroupCache(interactionId: string, name: string) {
    const value = {
        [CreateGroupMenuIds.name]: name,
        [CreateGroupMenuIds.isOrdered]: '',
        [CreateGroupMenuIds.isPublic]: '',
    };
    return await cacheCreateGroupMenuUserSelection(interactionId, value);
}

async function onList(req: Request, res: Response) {
    const guild: Guild = res.locals.guild;

    const groups = await getGroups(guild.id);

    if (groups.length === 0) {
        return res.send(respondWithMessageInEmbed('No Role Groups Found', 'You have not set up any role groups', Status.warning));
    } else {
        const StringifiedGroupList = groups.map((r) => r.name).join('\n');
        return res.send(respondWithMessageInEmbed(`Found ${groups.length} Role Groups`, StringifiedGroupList));
    }
}

async function onDelete(req: Request, res: Response) {
    const guild: Guild = res.locals.guild;
    const groupList = await getGroups(guild.id);

    if (groupList.length === 0) {
        return res.send(respondWithMessageInEmbed('Nothing to delete', 'You have not set up any role groups', Status.warning));
    } else {
        const menuOptionsList: SelectOption[] = groupList.map((rg) => ({
            label: rg.name,
            value: rg.id,
        }));
        return res.send(respondWithInteractiveComponent('', [createActionRowComponent([makeDeleteGroupMenu(menuOptionsList)])]));
    }
}

async function onDeleteAll(req: Request, res: Response) {
    const guild: Guild = res.locals.guild;

    await deleteAllGroupsForGuild(guild.id);

    return res.send(respondWithMessageInEmbed(`Success`, 'All role groups has been deleted'));
}

async function initializeAddRole(interactionId: string) {
    const value: AddRole2GroupMenuIdsToData = {
        [AddRole2GroupMenuIds.roleMenu]: '',
        [AddRole2GroupMenuIds.groupMenu]: '',
    };
    cacheUserSelection(interactionId, value);
}

async function onAddRole(req: Request, res: Response) {
    const { body } = req;

    const guild: Guild = res.locals.guild;
    const groupList = await getGroups(guild.id);
    const roleList = await getGrouplessRoles(guild.id);

    if (roleList.length === 0) {
        return res.send(
            respondWithMessageInEmbed(
                'No Available Role Configuration',
                `You have either added all available role configurations to groups or have not set up any role configurations.\n Use "/${role.name} ${RoleOptions.create}" to create a new role configuration`,
                Status.warning
            )
        );
    } else if (groupList.length === 0) {
        return res.send(
            respondWithMessageInEmbed(
                'No Role Groups Found',
                `You have not set up any role groups.\nUse "/${group.name} ${GroupOptions.create}" to create a group`,
                Status.warning
            )
        );
    } else {
        const guildRoleList = await getGuildRoles(guild.discord_guild_id);
        const roleConfigMenuOptions: SelectOption[] = convertRoleListToSelectOptions(roleList, guildRoleList);
        const groupMenuOptions = convertGroupListToSelectOptions(groupList);
        await initializeAddRole(body.id);
        return res.send(
            respondWithInteractiveComponent('Select a role and select a role group to add the role to', [
                createActionRowComponent([makeAddRoleToGroupMenu2(groupMenuOptions)]),
                createActionRowComponent([makeAddRoleToGroupMenu1(roleConfigMenuOptions)]),
            ])
        );
    }
}

async function onRemoveRole(req: Request, res: Response) {
    const { body } = req;
    const guild: Guild = res.locals.guild;

    const roleList = await getGroupedRoles(guild.id);
    if (roleList.length === 0) {
        return res.send(
            respondWithMessageInEmbed(
                'No Available Role Configuration',
                `You have either added all available role configurations to groups or have not set up any role configurations.\n Use "/${role.name} ${RoleOptions.create}" to create a new role configuration`,
                Status.warning
            )
        );
    }
    const guildRoleList = await getGuildRoles(guild.discord_guild_id);
    const roleMenuList: SelectOption[] = convertRoleListToSelectOptions(roleList, guildRoleList);
    return res.send(
        respondWithInteractiveComponent('Select a role to be removed from a role group', [
            createActionRowComponent([makeRemoveRoleFromGroupMenu(roleMenuList)]),
        ])
    );
}
