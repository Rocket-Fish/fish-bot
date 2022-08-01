import { Request, Response } from 'express';
import { ApplicationCommand, ApplicationCommandTypes } from '../types';
import { getGuildByDiscordId, createGuild } from '../../../models/Guild';
import { InteractionResponseType } from 'discord-interactions';
import migrateGuildCommands from '../migrateGuildCommands';
import { CONFIGURE_ROLE_BY_ZONE } from './configure-role-by-zone';
import { TEST } from './test';

export const INIT: ApplicationCommand = {
    name: 'initialize',
    description: 'Initialize the bot to this server and install server commands',
    type: ApplicationCommandTypes.CHAT_INPUT,
    dm_permission: false,
    default_member_permissions: '0',
};

export async function handleInit(req: Request, res: Response) {
    const { guild_id } = req.body;

    // check if guild exists in database already
    const guild = await getGuildByDiscordId(guild_id);
    if (guild) {
        return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: { content: 'Server already initialized, you do not need to initialize it again.' },
        });
    } else {
        try {
            await createGuild(guild_id);
            // TODO: make this configurable later
            await migrateGuildCommands(guild_id, [TEST, CONFIGURE_ROLE_BY_ZONE]);
            return res.send({
                type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                data: { content: 'Initialization complete' },
            });
        } catch (e) {
            return res.send({
                type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                data: { content: `Initialization failed \n> ${e}` },
            });
        }
    }
}
