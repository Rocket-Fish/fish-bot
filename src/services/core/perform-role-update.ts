import { Guild } from '../../models/Guild';
import { RoleWithGroup, getRolesWithGroup, RuleType, FFlogsRule, RuleOperand, RuleCondition } from '../../models/Role';
import { updateCache } from '../discord/commands/for-each-member-in-server';
import { giveGuildMemberRole, removeRoleFromGuildMember } from '../discord/guilds';
import { GuildMember } from '../discord/types';
import { getCharacterZoneRankings } from '../fflogs/get-character-data';
import { CharacterNamingError, extractCharacter } from './extract-character';

export type RoleUpdateStatus = {
    progress: string;
    problems: string[];
    isComplete: boolean;
};

export async function performRoleUpdate(guild: Guild, members: GuildMember[]) {
    try {
        const roleList: RoleWithGroup[] = await getRolesWithGroup(guild.id);
        const status: RoleUpdateStatus = { progress: `0/${members.length}`, problems: [], isComplete: false };
        await updateCache(guild.id, status);
        let counter = 0;

        for (const member of members) {
            counter++;
            try {
                if (member.user.bot) throw new Error('Member is a bot');
                status.problems.push(...(await handleRoles(guild, roleList, member)));
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

function doesMemberHaveRole(member: GuildMember, role: RoleWithGroup) {
    return !!(member.roles as string[]).find((r) => r === role.discord_role_id);
}

type GroupCompletionStatus = {
    [k: string]: boolean;
};

function isCurrentGroupCompleted(groupCompletionStatus: GroupCompletionStatus, role: RoleWithGroup) {
    return role.group_id && role.group_id in groupCompletionStatus && groupCompletionStatus[role.group_id];
}

async function handleRoles(guild: Guild, roleList: RoleWithGroup[], member: GuildMember): Promise<string[]> {
    const problems = [];
    const groupCompletionStatus: GroupCompletionStatus = {};
    for (const role of roleList) {
        try {
            if (isCurrentGroupCompleted(groupCompletionStatus, role)) {
                // if the user has any remaining roles, then remove them
                if (doesMemberHaveRole(member, role)) {
                    await removeRoleFromGuildMember(guild.discord_guild_id, member.user.id, role.discord_role_id);
                }
                continue;
            }

            switch (role.rule.type) {
                case RuleType.everyone:
                    // if user doesn't already have this role, give it to them
                    if (!doesMemberHaveRole(member, role)) {
                        await giveGuildMemberRole(guild.discord_guild_id, member.user.id, role.discord_role_id);
                    }
                    if (role.group_id) {
                        groupCompletionStatus[role.group_id] = true;
                    }
                    break;
                case RuleType.noone:
                    // if user has this role, then remove it
                    if (doesMemberHaveRole(member, role)) {
                        await removeRoleFromGuildMember(guild.discord_guild_id, member.user.id, role.discord_role_id);
                    }
                    if (role.group_id) {
                        groupCompletionStatus[role.group_id] = true;
                    }
                    break;
                case RuleType.fflogs:
                    const isRuleSatisfied = await isFflogsRuleSatisfied(guild, role.rule, role, member);

                    if (isRuleSatisfied) {
                        if (!doesMemberHaveRole(member, role)) {
                            await giveGuildMemberRole(guild.discord_guild_id, member.user.id, role.discord_role_id);
                        }
                        if (role.group_id) {
                            groupCompletionStatus[role.group_id] = true;
                        }
                    } else if (doesMemberHaveRole(member, role)) {
                        // remove role if the user no longer satisfy conditions for the role
                        await removeRoleFromGuildMember(guild.discord_guild_id, member.user.id, role.discord_role_id);
                    }
                    break;
                default:
                    problems.push(`RuleType not supported`);
                    break;
            }
        } catch (e) {
            // catch role errors
            if (e instanceof CharacterNamingError || e instanceof ZoneRankingMissingError) {
                problems.push(`<@${member.user.id}> - ${e.message}`);
                break;
            } else {
                let problem = `<@&${role.discord_role_id}> <@${member.user.id}> - `;
                if (e instanceof Error) {
                    problem = problem + e.message;
                } else {
                    problem = problem + e;
                }
                problems.push(problem);
            }
        }
    }
    return problems;
}

async function isFflogsRuleSatisfied(guild: Guild, rule: FFlogsRule, role: Exclude<RoleWithGroup, 'rule'>, member: GuildMember): Promise<boolean> {
    const nickname = member.nick;
    const character = extractCharacter(nickname || '');

    if (rule.area.difficulty) {
        // only zone areas have difficulty level, encounters don't have it
        const characterZoneRankings = await getCharacterZoneRankings(character.name, character.world, rule.area.id, rule.area.difficulty);
        if (!characterZoneRankings?.character?.zoneRankings?.rankings) throw new ZoneRankingMissingError('Zone Ranking is missing');
        const rankings: Ranking[] = characterZoneRankings.character.zoneRankings.rankings;
        const isRuleSatisfied = conditionComparison[rule.condition](resolvedOperand[rule.operand](rankings));
        return isRuleSatisfied;
    } else {
        // TODO: implement role rule area type 'encounter'
    }

    return false;
}

type Ranking = {
    rankPercent: number;
};

type OperandToResolve = {
    [k in RuleOperand]: (rankings: Ranking[]) => number;
};

type ConditionToBoolean = {
    [k in RuleCondition]: (resolvedOperand: number) => boolean;
};

const resolvedOperand: OperandToResolve = {
    [RuleOperand.numberOrangeParses]: (rankings: Ranking[]) => rankings.reduce((acc, cur) => acc + Number(cur.rankPercent >= 95), 0),
    [RuleOperand.numberPinkParses]: (rankings: Ranking[]) => rankings.reduce((acc, cur) => acc + Number(cur.rankPercent >= 99), 0),
    [RuleOperand.numberPurpleParses]: (rankings: Ranking[]) => rankings.reduce((acc, cur) => acc + Number(cur.rankPercent >= 75), 0),
};

const conditionComparison: ConditionToBoolean = {
    [RuleCondition.greaterThanOrEqualTo4]: (operand: number) => operand >= 4,
    [RuleCondition.greaterThanOrEqualTo3]: (operand: number) => operand >= 3,
};

export class ZoneRankingMissingError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ZoneRankingMissingError';
    }
}
