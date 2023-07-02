import db from '../db';

export type Group = {
    id: string;
    guild_id: string;
    name: string;
    created_at: number;
    updated_at: number;
    is_ordered: boolean;
    is_public: boolean;
};

export const groups = 'groups';

export function createGroup(guild_id: string, name: string, is_ordered = false, is_public = false): Promise<void> {
    return new Promise((resolve, reject) => {
        db.from<Group>(groups)
            .insert({ name, guild_id, is_ordered, is_public })
            .then(() => resolve())
            .catch((e) => reject(e));
    });
}

export function getGroups(guild_id: string): Promise<Group[]> {
    return new Promise((resolve, reject) => {
        db.from<Group>(groups)
            .where('guild_id', guild_id)
            .then((groups) => resolve(groups))
            .catch((e) => reject(e));
    });
}

export function deleteGroup(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
        db.from<Group>(groups)
            .where('id', id)
            .del()
            .then(() => resolve())
            .catch((e) => reject(e));
    });
}

export function deleteAllGroupsForGuild(guild_id: string): Promise<void> {
    return new Promise((resolve, reject) => {
        db.from<Group>(groups)
            .where('guild_id', guild_id)
            .del()
            .then(() => resolve())
            .catch((e) => reject(e));
    });
}
