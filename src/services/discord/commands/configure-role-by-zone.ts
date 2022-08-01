import { Request, Response } from 'express';
import { ApplicationCommand, ApplicationCommandTypes } from '../types';
import { Comparisons, Conditions, purpleCount } from './options';
import { InteractionResponseType, MessageComponentTypes } from 'discord-interactions';
import { createRole, Rule } from '../../../models/Role';
import { getGuildByDiscordId } from '../../../models/Guild';
import { INIT } from './init';

export const CONFIGURE_ROLE_BY_ZONE: ApplicationCommand = {
    name: 'configure-role-by-zone',
    description: 'Configures the condition of giving out a specific role in this server, based on fflogs zone',
    type: ApplicationCommandTypes.CHAT_INPUT,
    options: [purpleCount],
    default_member_permissions: '0', // default to disable for everyone except server admins
};

/**
 * Sample expected data
 *
 * {
 *   guild_id: '1002952001379893248',
 *   id: '1003667611139194962',
 *   name: 'configure-role-by-zone',
 *   options: [
 *     {
 *       name: 'purple-count',
 *       options: [
 *         {
 *           name: 'greater-than',
 *           options: [
 *             { name: 'role', type: 8, value: '1003365394964303872' },
 *             { name: 'zone', type: 4, value: 44 },
 *             { name: 'greater-than', type: 10, value: 4 }
 *           ],
 *           type: 1
 *         }
 *       ],
 *       type: 2
 *     }
 *   ],
 *   resolves: {...},
 *   type: 1
 * }
 */

export type ExpectedConfigureRoleByZoneRequestBodyData = {
    id: string;
    guild_id: string;
    name: string;
    type: number;
    options: {
        name: Conditions;
        type: number;
        options: {
            name: Comparisons;
            type: number;
            options: {
                name: string;
                type: number;
                value: string | number;
            }[];
        }[];
    }[];
};

export async function handleConfigureRoleByZone(req: Request, res: Response) {
    try {
        const data: ExpectedConfigureRoleByZoneRequestBodyData = req.body.data;

        const conditionOption = data.options[0];
        const comparisonOption = conditionOption.options[0];
        const roleNumber = String(comparisonOption.options[0].value);
        const zoneNumber = Number(comparisonOption.options[1].value);
        const comparisonValue = Number(comparisonOption.options[2].value);

        const guild = await getGuildByDiscordId(data.guild_id);
        if (!guild) {
            return res.send({
                type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                data: { content: `Guild not initialized please run /${INIT.name}` },
            });
        }

        const rule: Rule = {
            fflogsArea: { type: 'zone', value: zoneNumber },
            condition: conditionOption.name,
            comparison: {
                type: comparisonOption.name,
                value: comparisonValue,
            },
        };
        await createRole(guild.id, roleNumber, rule);

        return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
                embeds: [
                    {
                        title: 'Role Configuration Successfully Added',
                        description: `Role <@&${roleNumber}> will be given to users who has ${rule.condition} ${rule.comparison.type} ${rule.comparison.value} in ${rule.fflogsArea.type} ${rule.fflogsArea.value}`,
                        color: 0x00ff00,
                    },
                ],
                allowed_mentions: {
                    parse: ['users'],
                },
            },
        });
    } catch (e) {
        if (e instanceof TypeError)
            return res.send({
                type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                data: { content: 'Invalid Request structure' },
            });
        else
            return res.send({
                type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                data: { content: `Configure role filed for the following reason\n> ${e}` },
            });
    }
}
