import { Request, Response } from 'express';
import { Guild } from '../../../models/Guild';
import { RoleUpdateStatus } from '../../core/perform-role-update';
import redisClient from '../../redis-client';
import { SelectOption, createActionRowComponent } from '../components';
import { respondWithInteractiveComponent, respondWithMessageInEmbed, Status } from '../respondToInteraction';
import { ApplicationCommand, ApplicationCommandOptionTypes, ApplicationCommandTypes, GuildMember } from '../types';
import { ActionNotImplemented } from './types';
import { getGroups } from '../../../models/Group';
import { makeForEachMemberInServerUpdateRolesMenu } from '../components/for-each-member-in-server-update-roles-menu';

enum ActionForEachMember {
    updateRoles = 'update-roles',
}

export const forEachMember: ApplicationCommand = {
    name: 'for-each-member',
    description: 'Manage role configurations',
    type: ApplicationCommandTypes.CHAT_INPUT,
    options: [
        {
            name: ActionForEachMember.updateRoles,
            description: 'Update roles for everyone based on role configurations',
            type: ApplicationCommandOptionTypes.SUB_COMMAND,
        },
    ],
    default_member_permissions: '0', // default to disable for everyone except server admins
};

export async function handleForEachMember(req: Request, res: Response) {
    const { data } = req.body;
    ensureOneInstance(req, res);
    const option = data.options[0];
    switch (option.name) {
        case ActionForEachMember.updateRoles:
            return onUpdateRoles(req, res);
        default:
            throw new ActionNotImplemented();
    }
}

/**
 *
 * @throws Error if there is an active for-each-member instance running
 */
async function ensureOneInstance(req: Request, res: Response) {
    const guild: Guild = res.locals.guild;
    const json = await redisClient.get(forEachMemberKey(guild.id));
    if (json) {
        const status: RoleUpdateStatus = JSON.parse(json);
        if (!status.isComplete) {
            throw new Error('This is an expensive operation, you can only have ONE expensive operation running at a time');
        }
    }
}

export function forEachMemberKey(guildId: string) {
    return `4EachMemberIn:${guildId}`;
}

export function updateForEachMemberCache(guildId: string) {
    return (value: any) => redisClient.setEx(forEachMemberKey(guildId), 60 * 60, JSON.stringify(value));
}

async function onUpdateRoles(req: Request, res: Response) {
    const guild: Guild = res.locals.guild;

    const groupList = await getGroups(guild.id);

    if (groupList.length === 0) {
        return res.send(
            respondWithMessageInEmbed(
                'No Groups found',
                'You have not set up any role groups, You need to create at least one group and add roles to that group to run this command',
                Status.warning
            )
        );
    } else {
        const menuOptionsList: SelectOption[] = groupList.map((rg) => ({
            label: rg.name,
            value: rg.id,
        }));
        return res.send(
            respondWithInteractiveComponent('Select Groups of roles to apply to everyone', [
                createActionRowComponent([makeForEachMemberInServerUpdateRolesMenu(menuOptionsList)]),
            ])
        );
    }
}
