import { Guild } from '../../models/Guild';
import { RoleWithGroup, getRolesWithGroup, RuleType, FFlogsRule, RuleOperand, RuleCondition, FFlogsAreaType } from '../../models/Role';
import { giveGuildMemberRole, removeRoleFromGuildMember } from '../discord/guilds';
import { GuildMember } from '../discord/types';
import { getCharacterEncounterRankings, getCharacterZoneRankings } from '../fflogs/get-character-data';
import { CharacterNamingError, extractCharacter } from './extract-character';

export type RoleUpdateStatus = {
    progress: string;
    roleChanges: string[];
    problems: string[];
    isComplete: boolean;
};

export async function performRoleUpdate(guild: Guild, members: GuildMember[], groupsToProcess: string[], updateCache: (value: any) => Promise<any>) {
    try {
        const roleList: RoleWithGroup[] = await getRolesWithGroup(guild.id, groupsToProcess);
        const status: RoleUpdateStatus = { progress: `0/${members.length}`, problems: [], roleChanges: [], isComplete: false };
        await updateCache(status);
        let counter = 0;

        for (const member of members) {
            counter++;
            try {
                if (member.user.bot) throw new Error('Member is a bot');
                const { problems, changes } = await handleRoles(guild, roleList, member);
                status.problems.push(...problems);
                status.roleChanges.push(...changes);
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
            await updateCache(status);
        }
        status.isComplete = true;
        await updateCache(status);
    } catch (e) {
        // catch system errors
        console.log(e);
    }
}

function doesMemberHaveRole(member: GuildMember, role: RoleWithGroup, rolesGiven: string[]) {
    return !!(member.roles as string[]).find((r) => r === role.discord_role_id) || rolesGiven.includes(role.discord_role_id);
}

type GroupCompletionStatus = {
    [k: string]: boolean;
};

function isCurrentGroupCompleted(groupCompletionStatus: GroupCompletionStatus, role: RoleWithGroup) {
    return role.group_id && role.group_id in groupCompletionStatus && groupCompletionStatus[role.group_id];
}

type HandleRolesResponse = {
    problems: string[];
    changes: string[];
};

async function handleRoles(guild: Guild, roleList: RoleWithGroup[], member: GuildMember): Promise<HandleRolesResponse> {
    const problems = [];
    const changes = [];
    const groupCompletionStatus: GroupCompletionStatus = {};
    const rolesGiven = [];
    for (const role of roleList) {
        try {
            if (isCurrentGroupCompleted(groupCompletionStatus, role)) {
                // if the user has any remaining roles, then remove them
                if (doesMemberHaveRole(member, role, [])) {
                    await removeRoleFromGuildMember(guild.discord_guild_id, member.user.id, role.discord_role_id);
                    changes.push(`Removed <@&${role.discord_role_id}> from <@${member.user.id}>`);
                }
                continue;
            }

            switch (role.rule.type) {
                case RuleType.everyone:
                    // if user doesn't already have this role, give it to them
                    if (!doesMemberHaveRole(member, role, rolesGiven)) {
                        await giveGuildMemberRole(guild.discord_guild_id, member.user.id, role.discord_role_id);
                        rolesGiven.push(role.discord_role_id);
                        changes.push(`Given <@&${role.discord_role_id}> to <@${member.user.id}>`);
                    }
                    if (role.is_ordered && role.group_id) {
                        groupCompletionStatus[role.group_id] = true;
                    }
                    break;
                case RuleType.noone:
                    // if user has this role, then remove it
                    if (doesMemberHaveRole(member, role, [])) {
                        await removeRoleFromGuildMember(guild.discord_guild_id, member.user.id, role.discord_role_id);
                        changes.push(`Removed <@&${role.discord_role_id}> from <@${member.user.id}>`);
                    }
                    if (role.is_ordered && role.group_id) {
                        groupCompletionStatus[role.group_id] = true;
                    }
                    break;
                case RuleType.fflogs:
                    const isRuleSatisfied = await isFflogsRuleSatisfied(role.rule, member);

                    if (isRuleSatisfied) {
                        if (!doesMemberHaveRole(member, role, rolesGiven)) {
                            await giveGuildMemberRole(guild.discord_guild_id, member.user.id, role.discord_role_id);
                            rolesGiven.push(role.discord_role_id);
                            changes.push(`Given <@&${role.discord_role_id}> to <@${member.user.id}>`);
                        }
                        if (role.is_ordered && role.group_id) {
                            groupCompletionStatus[role.group_id] = true;
                        }
                    } else if (role.is_ordered && doesMemberHaveRole(member, role, [])) {
                        // TODO: maybe need to rethink this part, currently catering to the case if a single role is given to multiple encounters (like the ultimates), thats an unordered group scenario
                        // remove role if the user no longer satisfy conditions for the role
                        await removeRoleFromGuildMember(guild.discord_guild_id, member.user.id, role.discord_role_id);
                        changes.push(`Removed <@&${role.discord_role_id}> from <@${member.user.id}>`);
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
    return { problems, changes };
}

async function isFflogsRuleSatisfied(rule: FFlogsRule, member: GuildMember): Promise<boolean> {
    const nickname = member.nick;
    const character = extractCharacter(nickname || '');

    if (rule.area.type === FFlogsAreaType.zone) {
        if (rule?.area?.difficulty === undefined) {
            throw new Error('zone missing difficulty');
        }
        const characterZoneRankings = await getCharacterZoneRankings(character.name, character.world, rule.area.id, rule.area.difficulty);
        if (!characterZoneRankings?.character?.zoneRankings?.rankings) throw new ZoneRankingMissingError('Zone Ranking is missing');
        const rankings: Ranking[] = characterZoneRankings.character.zoneRankings.rankings;
        const isRuleSatisfied = conditionComparison[rule.condition](resolvedOperand[rule.operand](rankings));
        return isRuleSatisfied;
    } else if (rule.area.type === FFlogsAreaType.encounter) {
        const characterEncounterRankings = await getCharacterEncounterRankings(character.name, character.world, rule.area.id);
        if (!characterEncounterRankings?.character?.encounterRankings) throw new EncounterRankingMissingError('Encounter Ranking is missing');
        const encounterRankings: EncounterRankings = characterEncounterRankings.character.encounterRankings;
        const isRuleSatisfied = conditionComparison[rule.condition](resolvedOperand[rule.operand](encounterRankings));
        return isRuleSatisfied;
    } else {
        throw new Error('rule type not supported');
    }
}

type EncounterRankings = {
    totalKills: number;
};

type Ranking = {
    rankPercent: number;
};

type OperandToResolve = {
    // TODO: recode this any here, need to split encounter from zone operands
    [k in RuleOperand]: (rankings: any) => number;
};

type ConditionToBoolean = {
    [k in RuleCondition]: (resolvedOperand: number) => boolean;
};

const resolvedOperand: OperandToResolve = {
    [RuleOperand.numberOrangeParses]: (rankings: Ranking[]) => rankings.reduce((acc, cur) => acc + Number(cur.rankPercent >= 95), 0),
    [RuleOperand.numberPinkParses]: (rankings: Ranking[]) => rankings.reduce((acc, cur) => acc + Number(cur.rankPercent >= 99), 0),
    [RuleOperand.numberPurpleParses]: (rankings: Ranking[]) => rankings.reduce((acc, cur) => acc + Number(cur.rankPercent >= 75), 0),
    [RuleOperand.numberOfKills]: (encounterRankings: EncounterRankings) => encounterRankings.totalKills,
};

const conditionComparison: ConditionToBoolean = {
    [RuleCondition.greaterThanOrEqualTo4]: (operand: number) => operand >= 4,
    [RuleCondition.greaterThanOrEqualTo3]: (operand: number) => operand >= 3,
    [RuleCondition.greaterThanOrEqualTo2]: (operand: number) => operand >= 2,
    [RuleCondition.greaterThanOrEqualTo1]: (operand: number) => operand >= 1,
};

export class ZoneRankingMissingError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ZoneRankingMissingError';
    }
}
export class EncounterRankingMissingError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'EncounterRankingMissingError';
    }
}
