/***
 * TODO:
 * BIG TODO:
 *
 * Delete this Guild table completely
 * The only thing it is providing is a layer of separation from discord's guild_id vs this project's internal guild_id
 *
 * discord's IDs are generally snowflake IDs which should almost never change.
 *
 *
 *
 *
 *
 */

import db from '../db';

export type Guild = {
    id: string;
    discord_guild_id: string;
    created_at: number;
    updated_at: number;
};

const tableName = 'guilds';

export function getGuildByDiscordId(discordGuildId: string): Promise<Guild | undefined> {
    return new Promise((resolve, reject) => {
        db.from<Guild>(tableName)
            .where('discord_guild_id', discordGuildId)
            .first()
            .then((guild) => resolve(guild))
            .catch((e) => reject(e));
    });
}

export function createGuild(discordGuildId: string): Promise<void> {
    return new Promise((resolve, reject) => {
        db.from<Guild>(tableName)
            .insert({ discord_guild_id: discordGuildId })
            .then(() => resolve())
            .catch((e) => reject(e));
    });
}

export class GuildNotFoundError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'GuildNotFoundError';
    }
}
