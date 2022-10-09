import { InteractionResponseType } from 'discord-interactions';
import { Request, Response } from 'express';
import { ButtonComponent, ComponentButtonStyles, createButtonComponent } from '.';
import { Guild } from '../../../models/Guild';
import redisClient from '../../redis-client';
import { makeRedisKey, RoleUpdateStatus } from '../commands/for-each-member-in-server';

export function makeRefreshButton(): ButtonComponent {
    return createButtonComponent({
        custom_id: 'refresh_status',
        style: ComponentButtonStyles.primary,
        label: 'Refresh Status',
    });
}

export async function handleRefreshStatus(req: Request, res: Response) {
    const guild: Guild = res.locals.guild;

    const json = await redisClient.get(makeRedisKey(guild.id));

    if (json) {
        const status: RoleUpdateStatus = JSON.parse(json);
        let content = `**Progress:**\n${status.progress}${status.isComplete ? ' - Complete' : ' - In Progress'}${
            status.problems.length > 0 ? `\n\n**Problems:**\n${status.problems.join('\n')}` : ''
        }`;
        const discordMessageMaxLength = 1999;
        if (content.length > discordMessageMaxLength) {
            content = content.substring(0, discordMessageMaxLength - 5) + '[...]';
        }

        return res.send({
            type: InteractionResponseType.UPDATE_MESSAGE,
            data: {
                content,
                ...(status.isComplete && { components: [] }),
            },
        });
    }

    return res.send({
        type: InteractionResponseType.UPDATE_MESSAGE,
        data: {
            content: 'Critical Error while fetching status: There is no status to fetch',
        },
    });
}
