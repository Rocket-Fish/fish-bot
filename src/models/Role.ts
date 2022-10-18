import db from '../db';
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

export type FFlogsArea = {
    type: 'zone' | 'encounter';
    value: number;
};

export enum RuleType {
    noone = 'noone',
    everyone = 'everyone',
    fflogs = 'fflogs',
}

export type FFlogsRule = {
    type: RuleType.fflogs;
    area: FFlogsArea;
    operand: string; // TODO
    condition: string; //TODO
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
