import db from '../db';

export type Guild = {
    id: number;
    d_guild_id: string;
    created_at: number;
    updated_at: number;
};

const tableName = 'guilds';

export function getGuildByDiscordId(discordGuildId: string): Promise<Guild | undefined> {
    return new Promise((resolve, reject) => {
        db.from<Guild>(tableName)
            .where('d_guild_id', discordGuildId)
            .first()
            .then((guild) => resolve(guild))
            .catch((e) => reject(e));
    });
}

export function createGuild(discordGuildId: string): Promise<void> {
    return new Promise((resolve, reject) => {
        db.from<Guild>(tableName)
            .insert({ d_guild_id: discordGuildId })
            .then(() => resolve())
            .catch((e) => reject(e));
    });
}
