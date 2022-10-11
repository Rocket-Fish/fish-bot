import db from '../db';

export type RoleGroup = {
    id: string;
    guild_id: string;
    name: string;
    created_at: number;
    updated_at: number;
};

const tableName = 'role_groups';

export function createRoleGroup(guild_id: string, name: string): Promise<void> {
    return new Promise((resolve, reject) => {
        db.from<RoleGroup>(tableName)
            .insert({ name, guild_id })
            .then(() => resolve())
            .catch((e) => reject(e));
    });
}

export function getRoleGroups(guild_id: string): Promise<RoleGroup[]> {
    return new Promise((resolve, reject) => {
        db.from<RoleGroup>(tableName)
            .where('guild_id', guild_id)
            .then((groups) => resolve(groups))
            .catch((e) => reject(e));
    });
}

export function deleteRoleGroup(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
        db.from<RoleGroup>(tableName)
            .where('id', id)
            .del()
            .then(() => resolve())
            .catch((e) => reject(e));
    });
}

export function deleteAllRoleGroupsForGuild(guild_id: string): Promise<void> {
    return new Promise((resolve, reject) => {
        db.from<RoleGroup>(tableName)
            .where('guild_id', guild_id)
            .del()
            .then(() => resolve())
            .catch((e) => reject(e));
    });
}
