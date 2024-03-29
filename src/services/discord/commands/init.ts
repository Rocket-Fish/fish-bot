import { Request, Response } from 'express';
import { ApplicationCommand, ApplicationCommandTypes } from '../types';
import { getGuildByDiscordId, createGuild, Guild } from '../../../models/Guild';
import migrateGuildCommands from '../migrateGuildCommands';
import { test } from './test';
import { respondWithMessageInEmbed, Status } from '../respondToInteraction';
import { role } from './role';
import { forEachMember } from './for-each-member-in-server';
import { group } from './group';
import { gimmeRoles } from './gimme-roles';

export const init: ApplicationCommand = {
    name: 'initialize',
    description: 'Initialize the bot to this server and install server commands',
    type: ApplicationCommandTypes.CHAT_INPUT,
    dm_permission: false,
    default_member_permissions: '0',
};

async function migrateDefaultCommands(guildId: string) {
    return migrateGuildCommands(guildId, [test, role, group, forEachMember, gimmeRoles]);
}

export async function handleInit(req: Request, res: Response) {
    const { guild_id } = req.body;

    let guild: Guild | undefined = undefined;
    try {
        // check if guild exists in database already
        guild = await getGuildByDiscordId(guild_id);
        // mount default commands
        await migrateDefaultCommands(guild_id);
    } catch (e) {
        res.send(respondWithMessageInEmbed('Initialization Failed', `${e}`, Status.failure));
    }

    if (guild) {
        return res.send(
            respondWithMessageInEmbed(
                'Initialization Skipped; Commands Updated',
                `Server recognized as already initialized; Any modified server scoped slash commands has been updated`,
                Status.warning
            )
        );
    } else {
        try {
            await createGuild(guild_id);
            return res.send(
                respondWithMessageInEmbed(`Initialization Complete`, 'Bot iniialized for this server and server slash commands has been installed')
            );
        } catch (e) {
            res.send(respondWithMessageInEmbed('Initialization Failed', `${e}`, Status.failure));
        }
    }
}
