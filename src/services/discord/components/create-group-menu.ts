import { Request, Response } from 'express';
import { SelectOption, MenuComponent, createMenuComponent } from '.';
import redisClient from '../../redis-client';
import { InteractionResponseType } from 'discord-interactions';
import { createGroup } from '../../../models/Group';
import { respondWithAcknowledgement } from '../respondToInteraction';

export function makeCreateGroupMenu1(): MenuComponent {
    return createMenuComponent({
        custom_id: CreateGroupMenuIds.isOrdered,
        placeholder: 'Does ordering matter in this group?',
        options: [
            {
                label: 'Ordered',
                value: `true`,
            },
            {
                label: 'Unordered',
                value: `false`,
            },
        ],
    });
}

export function makeCreateGroupMenu2(): MenuComponent {
    return createMenuComponent({
        custom_id: CreateGroupMenuIds.isPublic,
        placeholder: 'Allow or disallow non-admin users to modify themselves?',
        options: [
            {
                label: 'Public',
                value: `true`,
            },
            {
                label: 'Private',
                value: `false`,
            },
        ],
    });
}

export enum CreateGroupMenuIds {
    name = 'create-group_name',
    isPublic = 'create-group_select-publicity',
    isOrdered = 'create-group_select-order',
}

export function addRole2GroupKey(interactionId: string) {
    return `createGroup:${interactionId}`;
}

export type CreateGroupMenuIdsToData = {
    [k in CreateGroupMenuIds]: string;
};

export async function cacheCreateGroupMenuUserSelection(interactionId: string, value: CreateGroupMenuIdsToData) {
    return await redisClient.setEx(addRole2GroupKey(interactionId), 60 * 30, JSON.stringify(value));
}

async function getCachedSelection(interactionId: string) {
    return await redisClient.get(addRole2GroupKey(interactionId));
}

function isSelectionComplete(value: CreateGroupMenuIdsToData) {
    return value[CreateGroupMenuIds.isPublic] && value[CreateGroupMenuIds.isOrdered];
}

export async function handleCreateCustomGroup(req: Request, res: Response) {
    const { body } = req;
    const { data } = body;
    const interactionId: string = body.message.interaction.id;
    const guild = res.locals.guild;

    // TODO: refactor this function has similar contents to handleCreateFFlogsRole()
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

    const cachedObject: CreateGroupMenuIdsToData = JSON.parse(cachedValue);
    const key: CreateGroupMenuIds = data.custom_id;

    const userSelection = {
        ...cachedObject,
        [key]: data.values[0],
    };

    await cacheCreateGroupMenuUserSelection(interactionId, userSelection);

    if (isSelectionComplete(userSelection)) {
        await createGroup(
            guild.id,
            userSelection[CreateGroupMenuIds.name],
            userSelection[CreateGroupMenuIds.isOrdered] === 'true',
            userSelection[CreateGroupMenuIds.isPublic] === 'true'
        );

        return res.send({
            type: InteractionResponseType.UPDATE_MESSAGE,
            data: {
                content: `Group ${userSelection[CreateGroupMenuIds.name]} created with the following properties: isOrdered=${
                    userSelection[CreateGroupMenuIds.isOrdered]
                }; isPublic=${userSelection[CreateGroupMenuIds.isPublic]}`,
                components: [],
            },
        });
    } else {
        return res.send(respondWithAcknowledgement());
    }
}
