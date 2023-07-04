import { InteractionResponseType } from 'discord-interactions';
import { Request, Response } from 'express';
import { ButtonComponent, ComponentButtonStyles, createButtonComponent } from '.';
import { Guild } from '../../../models/Guild';
import { RoleUpdateStatus } from '../../core/perform-role-update';
import redisClient from '../../redis-client';
import { forEachMemberKey } from '../commands/for-each-member-in-server';
import { gimmeRolesCacheKey } from '../commands/gimme-roles';
import performFollowup from '../performFollowup';

export enum RefreshButtonTypes {
    refreshForEachMember = 'refresh_for_each_member',
    refreshGimmeRoles = 'refresh_gimme_roles',
}
export function makeRefreshButton(id: RefreshButtonTypes): ButtonComponent {
    return createButtonComponent({
        custom_id: id,
        style: ComponentButtonStyles.primary,
        label: 'Refresh Status',
    });
}

export async function handleRefreshForEachMember(req: Request, res: Response) {
    const guild: Guild = res.locals.guild;

    const json = await redisClient.get(forEachMemberKey(guild.id));

    if (json) {
        const status: RoleUpdateStatus = JSON.parse(json);
        let content = `**Progress:**\n${status.progress}${status.isComplete ? ' - Complete' : ' - In Progress'}${
            status.problems.length > 0 ? `\n\n**Problems:**\n${status.problems.join('\n')}` : ''
        }`;
        const discordMessageMaxLength = 1999;
        if (content.length > discordMessageMaxLength) {
            content = content.substring(0, discordMessageMaxLength - 5) + '[...]'; // TODO: message concatenation
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

export async function handleRefreshGimmeRoles(req: Request, res: Response) {
    const guild: Guild = res.locals.guild;
    const { member, token: interactionToken } = req.body;

    const json = await redisClient.get(gimmeRolesCacheKey(member.user.id));

    if (json) {
        const status: RoleUpdateStatus = JSON.parse(json);
        let content = `Updat${status.isComplete ? 'ed' : 'ing'} roles for <@${member.user.id}>,\n\n**Role Changes**:\n${
            status.roleChanges.length > 0 ? status.roleChanges.join('\n') : `No changes ${status.isComplete ? 'were made' : '..... yet'}`
        }${status.problems.length > 0 ? `\n\n**Problems:**\n${status.problems.join('\n')}` : ''}`;
        const discordMessageMaxLength = 1999;
        if (content.length > discordMessageMaxLength) {
            content = content.substring(0, discordMessageMaxLength - 5) + '[...]'; // TODO: message concatenation
        }

        // if (status.isComplete) performFollowup(interactionToken, { content });

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
