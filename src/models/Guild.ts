import db from '../db';

export type Guild = {
    id: string;
    discord_guild_id: string;
    created_at: number;
    updated_at: number;
};

export const guilds = 'guilds';

export function getGuildByDiscordId(discordGuildId: string): Promise<Guild | undefined> {
    return new Promise((resolve, reject) => {
        db.from<Guild>(guilds)
            .where('discord_guild_id', discordGuildId)
            .first()
            .then((guild) => resolve(guild))
            .catch((e) => reject(e));
    });
}

export function createGuild(discordGuildId: string): Promise<void> {
    return new Promise((resolve, reject) => {
        db.from<Guild>(guilds)
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
