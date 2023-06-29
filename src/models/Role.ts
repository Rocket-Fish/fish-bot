import { Knex } from 'knex';
import db from '../db';
import { Group, groups } from './Group';
import { roleGroupWithPriority, RoleGroupWithPriority } from './RoleGroupWithPriority';

/**
 * Rule Object to be converted into a JSON string
 * {
 *   fflogArea: { type: "zone" | "encounter", value: zoneNumber as number },
 *   condition: 'purple-count' as string,
 *   comparison: {'greater-than' as string, value: 4 as number}
 * }
 *
 */

export type Role = {
    id: string;
    guild_id: string;
    discord_role_id: string;
    rule: Rule;
    created_at: number;
    updated_at: number;
};

type RoleStringified =
    | Role
    | {
          rule: string;
      };

export enum FFlogsDifficulty {
    savage = 101,
    normal = 100,
}

export type FFlogsArea = {
    type: 'encounter' | 'zone';
    id: number;
    difficulty?: FFlogsDifficulty;
};

export enum RuleType {
    noone = 'noone',
    everyone = 'everyone',
    fflogs = 'fflogs',
}

export enum RuleOperand {
    numberPinkParses = 'number_pink_parses',
    numberOrangeParses = 'number_orange_parses',
    numberPurpleParses = 'number_purple_parses',
}

export enum RuleCondition {
    greaterThanOrEqualTo3 = 'greater_than_or_equal_to_3',
    greaterThanOrEqualTo4 = 'greater_than_or_equal_to_4',
}

export type FFlogsRule = {
    type: RuleType.fflogs;
    area: FFlogsArea;
    operand: RuleOperand;
    condition: RuleCondition;
};

export type Rule =
    | FFlogsRule
    | {
          type: Exclude<RuleType, RuleType.fflogs>;
      };

export const roles = 'roles';

export function createRole(forGuild: string, discordRoleId: string, rule: Rule): Promise<void> {
    return new Promise((resolve, reject) => {
        db.from<RoleStringified>(roles)
            .insert({ guild_id: forGuild, discord_role_id: discordRoleId, rule: JSON.stringify(rule) })
            .then(() => resolve())
            .catch((e) => reject(e));
    });
}

export function getRoles(forGuild: string): Promise<Role[]> {
    return new Promise((resolve, reject) => {
        db.from<Role>(roles)
            .where('guild_id', forGuild)
            .then((roles) => resolve(roles))
            .catch((e) => reject(e));
    });
}

const dbQueryInPivotTableByRole = db.from<RoleGroupWithPriority>(roleGroupWithPriority).whereRaw(`${roleGroupWithPriority}.role_id = ${roles}.id`);

export function getGrouplessRoles(forGuild: string): Promise<Role[]> {
    return new Promise((resolve, reject) => {
        db.from<Role>(roles)
            .where('guild_id', forGuild)
            .whereNotExists(dbQueryInPivotTableByRole)
            .then((roles) => resolve(roles))
            .catch((e) => reject(e));
    });
}

export function getGroupedRoles(forGuild: string): Promise<Role[]> {
    return new Promise((resolve, reject) => {
        db.from<Role>(roles)
            .where('guild_id', forGuild)
            .whereExists(dbQueryInPivotTableByRole)
            .then((roles) => resolve(roles))
            .catch((e) => reject(e));
    });
}

export function deleteRole(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
        db.from(roles)
            .where('id', id)
            .del()
            .then(() => resolve())
            .catch((e) => reject(e));
    });
}

export function deleteAllRolesFromGuild(guildId: string): Promise<void> {
    return new Promise((resolve, reject) => {
        db.from(roles)
            .where('guild_id', guildId)
            .del()
            .then(() => resolve())
            .catch((e) => reject(e));
    });
}

export function removeRoleFromAllGroups(roleId: string): Promise<void> {
    return new Promise((resolve, reject) => {
        db.from(roleGroupWithPriority)
            .where('role_id', roleId)
            .del()
            .then(() => resolve())
            .catch((e) => reject(e));
    });
}

export type RoleWithGroup = Pick<Role, 'guild_id' | 'discord_role_id' | 'rule'> &
    Partial<Pick<Group, 'name'>> & {
        priority?: number;
        group_id?: string;
        role_id?: string;
    };

type Result = { rows: RoleWithGroup[] };
export function getRolesWithGroup(forGuild: string): Promise<RoleWithGroup[]> {
    const raw = `SELECT rgwp.group_id, rgwp.role_id, r.guild_id, r.discord_role_id, r.rule, rgwp.priority, g.name
    FROM ((${roles} r LEFT JOIN ${roleGroupWithPriority} rgwp ON r.id = rgwp.role_id) LEFT JOIN ${groups} g ON rgwp.group_id = g.id) 
    WHERE r.guild_id=?
    ORDER BY rgwp.group_id DESC, rgwp.priority`;

    return new Promise((resolve, reject) => {
        db.raw<Result>(raw, [forGuild])
            .then((result) => resolve(result.rows))
            .catch((e) => reject(e));
    });
}
