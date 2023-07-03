import { Request, Response } from 'express';
import { Guild } from '../../../models/Guild';
import { createRole, deleteAllRolesFromGuild, getRoles, getRolesWithGroup, Role, Rule, RuleType } from '../../../models/Role';
import { convertRoleConfigToSentance, convertRoleListToSelectOptions } from '../../../utils/convert';
import { createActionRowComponent, SelectOption } from '../components';
import { CreateFFlogsRoleProperties, CreateFFlogsRolePropertiesToData, createFflogsRole } from '../components/create-fflogs-role';
import { makeDeleteRoleConfigMenu } from '../components/delete-role-config-menu';
import { getGuildRoles } from '../guilds';
import { respondWithInteractiveComponent, respondWithMessageInEmbed, Status } from '../respondToInteraction';
import { ApplicationCommand, ApplicationCommandOptionTypes, ApplicationCommandTypes } from '../types';
import { discordRoleSelector } from './options/discord-role-selector';
import { roleConditionTypeSelector } from './options/role-condition-type-selector';
import { ActionNotImplemented } from './types';

export enum RoleOptions {
    create = 'create',
    list = 'list',
    delete = 'delete',
    deleteAll = 'delete-all',
}

export const role: ApplicationCommand = {
    name: 'role',
    description: 'Manage role configurations',
    type: ApplicationCommandTypes.CHAT_INPUT,
    options: [
        {
            name: RoleOptions.create,
            description: 'Create a role configuration',
            type: ApplicationCommandOptionTypes.SUB_COMMAND,
            options: [discordRoleSelector, roleConditionTypeSelector],
        },
        {
            name: RoleOptions.list,
            description: 'List all role configurations',
            type: ApplicationCommandOptionTypes.SUB_COMMAND,
        },
        {
            name: RoleOptions.delete,
            description: 'Delete a role configuration, you will have the opportunity to select which one to delete',
            type: ApplicationCommandOptionTypes.SUB_COMMAND,
        },
        {
            name: RoleOptions.deleteAll,
            description: 'Delete all the role configurations',
            type: ApplicationCommandOptionTypes.SUB_COMMAND,
        },
    ],
    default_member_permissions: '0', // default to disable for everyone except server admins
};

/*sample body data 
{
    guild_id: '1002952001379893248',
    id: '1025915642529988668',
    name: 'role',
    options: [
        {
            name: 'create',
            options: [
                { name: 'role', type: 8, value: '1002952001379893248' },
                { name: 'condition', type: 3, value: 'noone' }
            ],
            type: 1
        }
    ],
    resolved: {
        roles: {
            '1002952001379893248': {
                color: 0,
                flags: 0,
                hoist: false,
                icon: null,
                id: '1002952001379893248',
                managed: false,
                mentionable: false,
                name: '@everyone',
                permissions: '1071698660929',
                position: 0,
                unicode_emoji: null
            }
        }
    },
    type: 1
}
*/

/**
 *
 * @throws Error
 */
export async function handleRoleCommand(req: Request, res: Response) {
    const { data } = req.body;

    const roleOption = data.options[0];
    switch (roleOption.name) {
        case RoleOptions.create:
            return onCreate(req, res);
        case RoleOptions.list:
            return onList(req, res);
        case RoleOptions.delete:
            return onDelete(req, res);
        case RoleOptions.deleteAll:
            return onDeleteAll(req, res);
        default:
            throw new ActionNotImplemented();
    }
}

async function onCreate(req: Request, res: Response) {
    const { body } = req;
    const { data } = body;
    const interactionId: string = body.id;
    const guild: Guild = res.locals.guild;

    const roleOption = data.options[0];
    const params = roleOption.options;
    const discordRole = params[0].value;
    const condition = params[1].value;

    switch (condition) {
        case RuleType.everyone: {
            const rule: Rule = { type: RuleType.everyone };
            await createRole(guild.id, discordRole, rule);
            return res.send(
                respondWithMessageInEmbed(
                    `Role Rule Created`,
                    `Role <@&${discordRole}> will be given to every member, unless another role in role-group has higher priority`,
                    Status.success
                )
            );
        }
        case RuleType.noone: {
            const rule: Rule = { type: RuleType.noone };
            await createRole(guild.id, discordRole, rule);
            return res.send(
                respondWithMessageInEmbed(`Role Rule Created`, `Role <@&${discordRole}> will be removed from anyone who has it`, Status.success)
            );
        }
        case RuleType.fflogs:
            const response = await createFflogsRole.initInteraction(interactionId, {
                [CreateFFlogsRoleProperties.roleId]: discordRole,
                [CreateFFlogsRoleProperties.selectCondition]: '',
                [CreateFFlogsRoleProperties.selectOperand]: '',
                [CreateFFlogsRoleProperties.selectZone]: '',
            });
            return res.send(response);
        default:
            throw new ActionNotImplemented();
    }
}

async function onList(req: Request, res: Response) {
    const guild: Guild = res.locals.guild;
    const roleList = await getRolesWithGroup(guild.id);

    if (roleList.length === 0) {
        return res.send(respondWithMessageInEmbed('Zero Role Configurations Found', 'You have not set up any role configurations', Status.warning));
    } else {
        const stringifiedRoleList = roleList.reduce(
            (acc, cur) => ({
                groupId: cur.group_id || '',
                value: `${acc.value}${cur.group_id === acc.groupId ? '' : `\n\n**${cur.name || 'Groupless'}**`}\n<@&${
                    cur.discord_role_id
                }>: ${convertRoleConfigToSentance(cur.rule)}`,
            }),
            { groupId: '', value: '' }
        ).value;
        return res.send(respondWithMessageInEmbed(`Found ${roleList.length} Role Configurations`, stringifiedRoleList));
    }
}

async function onDelete(req: Request, res: Response) {
    const guild: Guild = res.locals.guild;
    const roleList = await getRoles(guild.id);

    if (roleList.length === 0) {
        return res.send(respondWithMessageInEmbed('Nothing to delete', 'You have not set up any role configurations', Status.warning));
    } else {
        const guildRoleList = await getGuildRoles(guild.discord_guild_id);
        const roleConfigMenuOptions: SelectOption[] = convertRoleListToSelectOptions(roleList, guildRoleList);
        return res.send(respondWithInteractiveComponent('', [createActionRowComponent([makeDeleteRoleConfigMenu(roleConfigMenuOptions)])]));
    }
}

async function onDeleteAll(req: Request, res: Response) {
    const guild: Guild = res.locals.guild;

    await deleteAllRolesFromGuild(guild.id);

    return res.send(respondWithMessageInEmbed(`Success`, 'All role configurations has been deleted'));
}
