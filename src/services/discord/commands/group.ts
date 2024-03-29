import { Request, Response } from 'express';
import { Guild } from '../../../models/Guild';
import { getGroupedRoles, getGrouplessRoles } from '../../../models/Role';
import { createGroup, deleteAllGroupsForGuild, getGroups } from '../../../models/Group';
import { convertGroupListToSelectOptions, convertRoleListToSelectOptions } from '../../../utils/convert';
import { SelectOption, createActionRowComponent } from '../components';
import { AddRole2GroupProperties, addRole2GroupMenu } from '../components/add-role-to-group-menu';
import { makeDeleteGroupMenu } from '../components/delete-role-group-menu';
import { getGuildRoles } from '../guilds';
import { respondWithInteractiveComponent, respondWithMessageInEmbed, Status } from '../respondToInteraction';
import { ApplicationCommand, ApplicationCommandOptionTypes, ApplicationCommandTypes } from '../types';
import { groupCustomize, groupNameInput } from './options/role-group-name-input';
import { role, RoleOptions } from './role';
import { ActionNotImplemented } from './types';
import { makeRemoveRoleFromGroupMenu } from '../components/remove-role-from-group-menu';
import { CreateGroupProperties, EditGroupProperties, createGroupMenu, editGroupMenu } from '../components/group-menu';

export enum GroupOptions {
    create = 'create',
    list = 'list',
    edit = 'edit',
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
            name: GroupOptions.edit,
            description: 'Edit a role group',
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
        case GroupOptions.edit:
            return onEdit(req, res);
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
    const { data, id: interactionId } = req.body;

    const guild: Guild = res.locals.guild;

    let name: string = data.options[0].options[0].value;
    name = name.replaceAll(/[^a-zA-Z0-9 -]/g, '');

    const customize: string | undefined = data.options[0].options?.[1]?.value;

    if (customize) {
        const response = await createGroupMenu.initInteraction(interactionId, {
            [CreateGroupProperties.name]: name,
            [CreateGroupProperties.isOrdered]: '',
            [CreateGroupProperties.isPublic]: '',
        });
        return res.send(response);
    } else {
        await createGroup(guild.id, name);
        return res.send(respondWithMessageInEmbed(`Role-Group Created`, `name: ${name}\nType: Private Unordered`));
    }
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

async function onEdit(req: Request, res: Response) {
    const { id: interactionId } = req.body;
    const guild: Guild = res.locals.guild;
    const groupList = await getGroups(guild.id);

    if (groupList.length === 0) {
        return res.send(respondWithMessageInEmbed('Nothing to Edit', 'You have not set up any role groups', Status.warning));
    } else {
        const menuOptionsList: SelectOption[] = groupList.map((rg) => ({
            label: rg.name,
            value: rg.id,
        }));

        const response = await editGroupMenu.initInteraction(
            interactionId,
            {
                [EditGroupProperties.id]: '',
                [EditGroupProperties.isOrdered]: '',
                [EditGroupProperties.isPublic]: '',
                [EditGroupProperties.saveButton]: '',
                [EditGroupProperties.cancelButton]: '',
            },
            [menuOptionsList]
        );
        return res.send(response);
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

async function onAddRole(req: Request, res: Response) {
    const { body } = req;
    const { id: interactionId } = body;

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

        const response = await addRole2GroupMenu.initInteraction(
            interactionId,
            {
                [AddRole2GroupProperties.roleMenu]: '',
                [AddRole2GroupProperties.groupMenu]: '',
            },
            [roleConfigMenuOptions, groupMenuOptions]
        );
        return res.send(response);
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
