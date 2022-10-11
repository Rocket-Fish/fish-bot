import { Request, Response } from 'express';
import { Guild } from '../../../models/Guild';
import { getRoles } from '../../../models/Role';
import { createRoleGroup, deleteAllRoleGroupsForGuild, getRoleGroups } from '../../../models/RoleGroup';
import { convertRoleGroupListToSelectOptions, convertRoleListToSelectOptions } from '../../../utils/convert';
import { SelectOption, createActionRowComponent } from '../components';
import { makeAddRoleToGroupMenu1, makeAddRoleToGroupMenu2 } from '../components/add-role-to-group-menu';
import { makeDeleteRoleGroupMenu } from '../components/delete-role-group-menu';
import { getGuildRoles } from '../guilds';
import { respondWithInteractiveComponent, respondWithMessageInEmbed, Status } from '../respondToInteraction';
import { ApplicationCommand, ApplicationCommandOptionTypes, ApplicationCommandTypes } from '../types';
import { roleGroupNameInput } from './options/role-group-name-input';
import { role, RoleOptions } from './role';
import { ActionNotImplemented } from './types';

export enum RoleGroupOptions {
    create = 'create',
    list = 'list',
    delete = 'delete',
    deleteAll = 'delete-all',
    addRole = 'add-role',
    removeRole = 'remove-role',
    orderRoles = 'order-roles',
}

export const roleGroup: ApplicationCommand = {
    name: 'role-group',
    description: 'Manage role groups; only one role per role group will be given to a member',
    type: ApplicationCommandTypes.CHAT_INPUT,
    options: [
        {
            name: RoleGroupOptions.create,
            description: 'Create a role group',
            type: ApplicationCommandOptionTypes.SUB_COMMAND,
            options: [roleGroupNameInput],
        },
        {
            name: RoleGroupOptions.list,
            description: 'Lists all role groups',
            type: ApplicationCommandOptionTypes.SUB_COMMAND,
        },
        {
            name: RoleGroupOptions.delete,
            description: 'Delete a role group',
            type: ApplicationCommandOptionTypes.SUB_COMMAND,
        },
        {
            name: RoleGroupOptions.deleteAll,
            description: 'Delete all role groups',
            type: ApplicationCommandOptionTypes.SUB_COMMAND,
        },
        {
            name: RoleGroupOptions.addRole,
            description: 'Add a role to this a role group',
            type: ApplicationCommandOptionTypes.SUB_COMMAND,
        },
    ],
};

export async function handleRoleGroupCommand(req: Request, res: Response) {
    const { data } = req.body;

    const option = data.options[0];
    switch (option.name) {
        case RoleGroupOptions.create:
            return onCreate(req, res);
        case RoleGroupOptions.list:
            return onList(req, res);
        case RoleGroupOptions.delete:
            return onDelete(req, res);
        case RoleGroupOptions.deleteAll:
            return onDeleteAll(req, res);
        case RoleGroupOptions.addRole:
            return onAddRole(req, res);
        default:
            throw new ActionNotImplemented();
    }
}

async function onCreate(req: Request, res: Response) {
    const { data } = req.body;
    const guild: Guild = res.locals.guild;

    let name: string = data.options[0].options[0].value;
    name = name.replaceAll(/[^a-zA-Z -]/g, '');

    await createRoleGroup(guild.id, name);

    return res.send(respondWithMessageInEmbed(`Role-Group Created`, `name: ${name}`));
}

async function onList(req: Request, res: Response) {
    const guild: Guild = res.locals.guild;

    const groups = await getRoleGroups(guild.id);

    if (groups.length === 0) {
        return res.send(respondWithMessageInEmbed('Zero Role Groups Found', 'You have not set up any role groups', Status.warning));
    } else {
        const StringifiedRoleGroupList = groups.map((r) => r.name).join('\n');
        return res.send(respondWithMessageInEmbed(`Found ${groups.length} Role Groups`, StringifiedRoleGroupList));
    }
}

async function onDelete(req: Request, res: Response) {
    const guild: Guild = res.locals.guild;
    const roleGroupList = await getRoleGroups(guild.id);

    if (roleGroupList.length === 0) {
        return res.send(respondWithMessageInEmbed('Nothing to delete', 'You have not set up any role groups', Status.warning));
    } else {
        const menuOptionsList: SelectOption[] = roleGroupList.map((rg) => ({
            label: rg.name,
            value: rg.id,
        }));
        return res.send(respondWithInteractiveComponent('', [createActionRowComponent([makeDeleteRoleGroupMenu(menuOptionsList)])]));
    }
}

async function onDeleteAll(req: Request, res: Response) {
    const guild: Guild = res.locals.guild;

    await deleteAllRoleGroupsForGuild(guild.id);

    return res.send(respondWithMessageInEmbed(`Success`, 'All role groups has been deleted'));
}

async function onAddRole(req: Request, res: Response) {
    const guild: Guild = res.locals.guild;
    const roleGroupList = await getRoleGroups(guild.id);
    const roleList = await getRoles(guild.id);

    if (roleList.length === 0) {
        return res.send(
            respondWithMessageInEmbed(
                'Zero Role Configurations Found',
                `You have not set up any role configurations.\n Use "/${role.name} ${RoleOptions.create}" to create a role configuration`,
                Status.warning
            )
        );
    } else if (roleGroupList.length === 0) {
        return res.send(
            respondWithMessageInEmbed(
                'Zero Role Groups Found',
                `You have not set up any role groups.\nUse "/${roleGroup.name} ${RoleGroupOptions.create}" to create a group`,
                Status.warning
            )
        );
    } else {
        const guildRoleList = await getGuildRoles(guild.discord_guild_id);
        const roleConfigMenuOptions: SelectOption[] = convertRoleListToSelectOptions(roleList, guildRoleList);
        const roleGroupMenuOptions = convertRoleGroupListToSelectOptions(roleGroupList);
        return res.send(
            respondWithInteractiveComponent('Select a role and select a role group to add the role to', [
                createActionRowComponent([makeAddRoleToGroupMenu1(roleConfigMenuOptions)]),
                createActionRowComponent([makeAddRoleToGroupMenu2(roleGroupMenuOptions)]),
            ])
        );
    }
}
