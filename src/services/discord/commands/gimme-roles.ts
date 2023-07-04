import { Request, Response } from 'express';
import { ApplicationCommand, ApplicationCommandTypes } from '../types';
import { Guild } from '../../../models/Guild';
import { getPublicGroups } from '../../../models/Group';
import { SelectOption, createActionRowComponent } from '../components';
import { respondWithMessageInEmbed, Status, respondWithInteractiveComponent } from '../respondToInteraction';
import { makeGimmeRoleMenu } from '../components/gimme-role-menu';
import redisClient from '../../redis-client';
import { RoleUpdateStatus } from '../../core/perform-role-update';

export const gimmeRoles: ApplicationCommand = {
    name: 'gimme-roles',
    description: 'Give me roles',
    type: ApplicationCommandTypes.CHAT_INPUT,
};

/**
 *
 * @throws Error if there is an active for-each-member instance running
 */
async function ensureOneInstance(req: Request, res: Response) {
    const member = req.body.member;
    const json = await redisClient.get(gimmeRolesCacheKey(member.user.id));
    if (json) {
        const status: RoleUpdateStatus = JSON.parse(json);
        if (!status.isComplete) {
            throw new Error(
                'You have a pending gimme-role operation in progress, please finish that operation to reduce chance of conflict. If you have prematurely dismissed a dialogue without completing command initialization, then you must wait 5 minutes for the cache to timeout and flush itself out of existence.'
            );
        }
    }
}
// TODO: refactor this to merge this similar key generation functionality in for-each-member-server.ts
export function gimmeRolesCacheKey(memberId: string) {
    return `gimmeRolesCache:${memberId}`;
}

export function updateGimmeRolesCache(memberId: string) {
    return (value: any) => redisClient.setEx(gimmeRolesCacheKey(memberId), 5 * 60, JSON.stringify(value));
}

export async function handleGimmeRoles(req: Request, res: Response) {
    ensureOneInstance(req, res);

    const guild: Guild = res.locals.guild;

    const groupList = await getPublicGroups(guild.id);

    if (groupList.length === 0) {
        return res.send(
            respondWithMessageInEmbed(
                'No Public Groups found',
                'You have not set up any public role groups; Go poke your server admins to make a role group public',
                Status.warning
            )
        );
    } else {
        const menuOptionsList: SelectOption[] = groupList.map((rg) => ({
            label: rg.name,
            value: rg.id,
        }));
        return res.send(
            respondWithInteractiveComponent('Select a group of roles to apply to yourself', [
                createActionRowComponent([makeGimmeRoleMenu(menuOptionsList)]),
            ])
        );
    }
}
