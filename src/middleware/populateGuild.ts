import { Request, Response } from 'express';
import { Guild, getGuildByDiscordId, GuildNotFoundError } from '../models/Guild';
import { init } from '../services/discord/commands/init';

export async function populateGuild(req: Request, res: Response): Promise<[Request, Response]> {
    const { guild_id } = req.body;
    const guild = await getGuildByDiscordId(guild_id);
    if (!guild) {
        throw new GuildNotFoundError(`Guild not initialized; please run \`/${init.name}\``);
    }
    res.locals.guild = guild;
    return [req, res];
}
