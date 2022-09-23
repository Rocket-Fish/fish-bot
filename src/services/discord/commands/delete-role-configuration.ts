import { Request, Response } from 'express';
import { getGuildByDiscordId } from '../../../models/Guild';
import { getRoles } from '../../../models/Role';
import { defaultResponse, Status } from '../makeResponse';
import { ApplicationCommand, ApplicationCommandOptionTypes, ApplicationCommandTypes } from '../types';
import { INIT } from './init';

export async function generateDeleteRoleConfigurationCommand(guildId: number): Promise<ApplicationCommand> {
    const choices: { name: string; value: number }[] = [];

    try {
        const roleList = await getRoles(guildId);
        roleList.forEach(({ id, discord_role_id, rule }) => {
            choices.push({
                name: `<@&${discord_role_id}> :: ${rule.condition} is ${rule.comparison.type} ${rule.comparison.value} in ${rule.fflogsArea.type} ${rule.fflogsArea.value}`,
                value: id,
            });
        });
    } catch (e) {
        // do nothing here, list will just be empty
    }

    const command: ApplicationCommand = {
        name: 'delete-role-configuration',
        description: 'Deletes a role configuration',
        type: ApplicationCommandTypes.CHAT_INPUT,
        options: [
            {
                name: 'configuration',
                description: 'the configuration to be deleted',
                required: true,
                type: ApplicationCommandOptionTypes.INTEGER,
                choices,
            },
        ],
        default_member_permissions: '0', // default to disable for everyone except server admins
    };
    return command;
}

export async function handleListRoleConfiguration(req: Request, res: Response) {
    try {
        const { guild_id } = req.body;
        const guild = await getGuildByDiscordId(guild_id);
        if (!guild) {
            return res.send(defaultResponse(`List Role Configuration Failed`, `Guild not initialized; please run \`/${INIT.name}\``, Status.failure));
        }

        // check if the guild matches the configurations record just to be safe

        // if guild id matches the configuration record, then delete this configuration

        // TODO: finish this function
    } catch (e) {
        res.send(defaultResponse('Configure Role Failed', `${e}`, Status.failure));
    }
}
