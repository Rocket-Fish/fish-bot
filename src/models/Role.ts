import db from '../db';
import { Comparisons, Conditions } from '../services/discord/commands/options';

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
    id: number; // TODO: redo database and turn this into a uuid
    guild_id: number;
    d_role_id: string;
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

export type Rule = {
    fflogsArea: FFlogsArea;
    condition: Conditions;
    comparison: { type: Comparisons; value: number };
};

const tableName = 'roles';

export function createRole(forGuild: number, discordRoleId: string, rule: Rule): Promise<void> {
    return new Promise((resolve, reject) => {
        db.from<RoleStringified>(tableName)
            .insert({ guild_id: forGuild, d_role_id: discordRoleId, rule: JSON.stringify(rule) })
            .then(() => resolve())
            .catch((e) => reject(e));
    });
}

export function getRoles(forGuild: number): Promise<Role[]> {
    return new Promise((resolve, reject) => {
        db.from<Role>(tableName)
            .where('guild_id', forGuild)
            .then((roles) => resolve(roles))
            .catch((e) => reject(e));
    });
}
