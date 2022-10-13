import { InteractionResponseType } from 'discord-interactions';
import { Request, Response } from 'express';
import { SelectOption, MenuComponent, createMenuComponent } from '.';
import redisClient from '../../redis-client';
import { respondWithAcknowledgement } from '../respondToInteraction';

export enum AddRole2GroupMenuIds {
    roleMenu = 'add-role-to-group_select-role',
    groupMenu = 'add-role-to-group_select-group',
}

export function addRole2GroupKey(interactionId: string) {
    return `addRole2Group-${interactionId}`;
}

export type AddRole2GroupMenuIdsToData = {
    [k in AddRole2GroupMenuIds]: string;
};

export async function cacheUserSelection(interactionId: string, value: AddRole2GroupMenuIdsToData) {
    return await redisClient.setEx(addRole2GroupKey(interactionId), 60 * 30, JSON.stringify(value));
}

export async function getCachedSelection(interactionId: string) {
    return await redisClient.get(addRole2GroupKey(interactionId));
}

export function makeAddRoleToGroupMenu1(options: SelectOption[]): MenuComponent {
    return createMenuComponent({
        custom_id: AddRole2GroupMenuIds.roleMenu,
        placeholder: 'Select role configuration to be added to a role group',
        options,
    });
}

export function makeAddRoleToGroupMenu2(options: SelectOption[]): MenuComponent {
    return createMenuComponent({
        custom_id: AddRole2GroupMenuIds.groupMenu,
        placeholder: 'Select role group to receive the above role configuration',
        options,
    });
}

function isSelectionComplete(value: AddRole2GroupMenuIdsToData) {
    return value['add-role-to-group_select-group'] && value['add-role-to-group_select-role'];
}

export async function handleAddRoleToGroup(req: Request, res: Response) {
    const { body } = req;
    const { data } = body;
    const interactionId: string = body.message.interaction.id;

    const cachedValue: string | null = await getCachedSelection(interactionId);
    if (!cachedValue) {
        return res.send({
            type: InteractionResponseType.UPDATE_MESSAGE,
            data: {
                content: 'This component has timed out, please run the command again',
                components: [],
            },
        });
    }
    const cachedObject: AddRole2GroupMenuIdsToData = JSON.parse(cachedValue);
    const key: AddRole2GroupMenuIds = data.custom_id;

    const userSelection = {
        ...cachedObject,
        [key]: data.value,
    };

    await cacheUserSelection(interactionId, userSelection);

    if (isSelectionComplete(userSelection)) {
    } else {
        return res.send(respondWithAcknowledgement());
    }
}
