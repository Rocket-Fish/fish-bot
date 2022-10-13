import { Request, Response } from 'express';
import { Guild } from '../../../models/Guild';
import { getRoles, Role, Rule, RuleType } from '../../../models/Role';
import { sleep } from '../../../utils/sleep';
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
    return `4EachMemberIn-${guildId}`;
}

export async function updateCache(guildId: string, value: any) {
    return await redisClient.setEx(forEachMemberKey(guildId), 60 * 60, JSON.stringify(value));
}

async function onUpdateRoles(req: Request, res: Response) {
    const guild: Guild = res.locals.guild;
    const roleList = await getRoles(guild.id);

    if (roleList.length === 0) {
        return res.send(respondWithMessageInEmbed('Zero Role Configurations Found', 'You have not set up any role configurations', Status.warning));
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

        performRoleUpdate(guild, roleList, members);
        res.send(respondWithInteractiveComponent('Updating roles for all members', [createActionRowComponent([makeRefreshButton()])], false));
    }
}

export type RoleUpdateStatus = {
    progress: string;
    problems: string[];
    isComplete: boolean;
};

async function performRoleUpdate(guild: Guild, roleList: Role[], members: GuildMember[]) {
    try {
        const status: RoleUpdateStatus = { progress: `0/${members.length}`, problems: [], isComplete: false };
        await updateCache(guild.id, status);
        let counter = 0;

        for (const member of members) {
            counter++;
            try {
                if (member.user.bot) throw new Error('Member is a bot');
                const nickname = member.nick;
                // TODO: do something with nickname
                for (const role of roleList) {
                    try {
                        // check if user already has the role in question
                        const discordRole = (member.roles as string[]).find((r) => r === role.discord_role_id);

                        switch (role.rule.type) {
                            case RuleType.everyone:
                                // if user doesn't already have this role, give it to them
                                if (!discordRole) {
                                    await giveGuildMemberRole(guild.discord_guild_id, member.user.id, role.discord_role_id);
                                }
                                break;
                            case RuleType.noone:
                                // if user has this role, then remove it
                                if (discordRole) {
                                    await removeRoleFromGuildMember(guild.discord_guild_id, member.user.id, role.discord_role_id);
                                }
                                break;
                            case RuleType.fflogs:
                            // TODO: `Give role to users whos ...`
                            default:
                                status.problems.push(`RuleType [${role.rule.type}] not supported`);
                                break;
                        }
                    } catch (e) {
                        // catch role errors
                        let problem = `<@&${role.discord_role_id}> <@${member.user.id}> - `;
                        if (e instanceof Error) {
                            problem = problem + e.message;
                        } else {
                            problem = problem + e;
                        }
                        status.problems.push(problem);
                    }
                }
            } catch (e) {
                // catch member errors
                // catch role errors
                let problem = `<@${member.user.id}> - `;
                if (e instanceof Error) {
                    problem = problem + e.message;
                } else {
                    problem = problem + e;
                }
                status.problems.push(problem);
            }

            status.progress = `${counter}/${members.length}`;
            await updateCache(guild.id, status);
        }
        status.isComplete = true;
        await updateCache(guild.id, status);
    } catch (e) {
        // catch system errors
        console.log(e);
    }
}
