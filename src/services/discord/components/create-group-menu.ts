import { Request, Response } from 'express';
import { SelectOption, MenuComponent, createMenuComponent, InteractiveComponent, createActionRowComponent } from '.';
import redisClient from '../../redis-client';
import { InteractionResponseType } from 'discord-interactions';
import { createGroup } from '../../../models/Group';
import { respondWithAcknowledgement, respondWithInteractiveComponent } from '../respondToInteraction';

export const CREATE_GROUP_MENU = 'CREATE_GROUP_MENU';
export const createGroupMenu = new InteractiveComponent<CreateGroupMenuPropertiesToData>(
    CREATE_GROUP_MENU,
    generateInteraction,
    handleCreateCustomGroup
);

function generateInteraction() {
    return respondWithInteractiveComponent('Select Options for Group', [
        createActionRowComponent([
            createMenuComponent({
                custom_id: CreateGroupMenuProperties.isOrdered,
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
            }),
        ]),
        createActionRowComponent([
            createMenuComponent({
                custom_id: CreateGroupMenuProperties.isPublic,
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
            }),
        ]),
    ]);
}

export enum CreateGroupMenuProperties {
    name = 'create-group_name',
    isPublic = 'create-group_select-publicity',
    isOrdered = 'create-group_select-order',
}

export type CreateGroupMenuPropertiesToData = {
    [k in CreateGroupMenuProperties]: string;
};

function isSelectionComplete(value: CreateGroupMenuPropertiesToData) {
    return value[CreateGroupMenuProperties.isPublic] && value[CreateGroupMenuProperties.isOrdered];
}

export async function handleCreateCustomGroup(req: Request, res: Response, cache: CreateGroupMenuPropertiesToData) {
    const { body } = req;
    const { data } = body;
    const interactionId: string = body.message.interaction.id;
    const guild = res.locals.guild;

    if (isSelectionComplete(cache)) {
        await createGroup(
            guild.id,
            cache[CreateGroupMenuProperties.name],
            cache[CreateGroupMenuProperties.isOrdered] === 'true',
            cache[CreateGroupMenuProperties.isPublic] === 'true'
        );

        return res.send({
            type: InteractionResponseType.UPDATE_MESSAGE,
            data: {
                content: `Group ${cache[CreateGroupMenuProperties.name]} created with the following properties: isOrdered=${
                    cache[CreateGroupMenuProperties.isOrdered]
                }; isPublic=${cache[CreateGroupMenuProperties.isPublic]}`,
                components: [],
            },
        });
    } else {
        return res.send(respondWithAcknowledgement());
    }
}
