import { Request, Response } from 'express';
import { Guild } from '../../../models/Guild';
import { getRoles, Role, Rule, RuleType } from '../../../models/Role';
import { sleep } from '../../../utils/sleep';
import { performRoleUpdate, RoleUpdateStatus } from '../../core/perform-role-update';
import redisClient from '../../redis-client';
import { createActionRowComponent } from '../components';
import { makeRefreshButton } from '../components/refresh-button';
import { getGuildMembers, giveGuildMemberRole, removeRoleFromGuildMember } from '../guilds';
import { respondWithInteractiveComponent, respondWithMessageInEmbed, Status } from '../respondToInteraction';
import { ApplicationCommand, ApplicationCommandOptionTypes, ApplicationCommandTypes, GuildMember } from '../types';
import { ActionNotImplemented } from './types';

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

export async function updateCache(guildId: string, value: any) {
    return await redisClient.setEx(forEachMemberKey(guildId), 60 * 60, JSON.stringify(value));
}

async function onUpdateRoles(req: Request, res: Response) {
    const guild: Guild = res.locals.guild;
    const roleList = await getRoles(guild.id);

    if (roleList.length === 0) {
        return res.send(respondWithMessageInEmbed('No Role Configurations Found', 'You have not set up any role configurations', Status.warning));
    } else {
        let members: GuildMember[] = [];
        let lastMember: GuildMember | undefined = undefined;
        while (true) {
            const fetchedMembers: GuildMember[] = await getGuildMembers(guild.discord_guild_id, lastMember?.user?.id);
            if (fetchedMembers.length === 0) {
                break;
            }
            members = members.concat(fetchedMembers);
            lastMember = fetchedMembers[fetchedMembers.length - 1];
            await sleep(500);
        }

        performRoleUpdate(guild, members);
        res.send(respondWithInteractiveComponent('Updating roles for all members', [createActionRowComponent([makeRefreshButton()])], false));
    }
}
