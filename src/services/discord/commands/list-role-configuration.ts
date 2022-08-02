import { Request, Response } from 'express';
import { getGuildByDiscordId } from '../../../models/Guild';
import { getRoles } from '../../../models/Role';
import { responseToDiscord, Status } from '../responseToDiscord';
import { ApplicationCommand, ApplicationCommandTypes } from '../types';
import { INIT } from './init';

export const LIST_ROLE_CONFIGURATION: ApplicationCommand = {
    name: 'list-role-configration',
    description: 'Outputs a list of all the configured role rules',
    type: ApplicationCommandTypes.CHAT_INPUT,
    default_member_permissions: '0', // default to disable for everyone except server admins
};

export async function handleListRoleConfiguration(req: Request, res: Response) {
    try {
        const { guild_id } = req.body;
        const guild = await getGuildByDiscordId(guild_id);
        if (!guild) {
            return res.send(
                responseToDiscord(`List Role Configuration Failed`, `Guild not initialized; please run \`/${INIT.name}\``, Status.failure)
            );
        }

        const roleList = await getRoles(guild.id);

        if (roleList.length === 0) {
            return res.send(responseToDiscord('Zero Role Configurations Found', 'You have not set up any role configurations', Status.warning));
        } else {
            const StringifiedRoleList = roleList
                .map(
                    ({ rule, d_role_id }) =>
                        `Give <@&${d_role_id}> to users who has ${rule.condition} ${rule.comparison.type} ${rule.comparison.value} in ${rule.fflogsArea.type} ${rule.fflogsArea.value}`
                )
                .join('\n\n');
            return res.send(responseToDiscord(`Found ${roleList.length} Role Configurations`, StringifiedRoleList));
        }
    } catch (e) {
        res.send(responseToDiscord('Configure Role Failed', `${e}`, Status.failure));
    }
}
