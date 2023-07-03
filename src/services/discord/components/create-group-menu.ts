import { Request, Response } from 'express';
import { createMenuComponent, InteractiveComponent, createActionRowComponent } from '.';
import { InteractionResponseType } from 'discord-interactions';
import { createGroup } from '../../../models/Group';
import { respondWithAcknowledgement, respondWithInteractiveComponent } from '../respondToInteraction';

export const CREATE_GROUP = 'CreateGroup';
export const createGroupMenu = new InteractiveComponent<CreateGroupPropertiesToData>(CREATE_GROUP, generateInteraction, handleCreateCustomGroup);

function generateInteraction() {
    return respondWithInteractiveComponent('Select Options for Group', [
        createActionRowComponent([makeOrderMenu()]),
        createActionRowComponent([makePublicityMenu()]),
    ]);
}

function makeOrderMenu() {
    return createMenuComponent({
        custom_id: CreateGroupProperties.isOrdered,
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

function makePublicityMenu() {
    return createMenuComponent({
        custom_id: CreateGroupProperties.isPublic,
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

export enum CreateGroupProperties {
    name = 'create-group_name',
    isPublic = 'create-group_select-publicity',
    isOrdered = 'create-group_select-order',
}

export type CreateGroupPropertiesToData = {
    [k in CreateGroupProperties]: string;
};

function isSelectionComplete(value: CreateGroupPropertiesToData) {
    return value[CreateGroupProperties.isPublic] && value[CreateGroupProperties.isOrdered];
}

async function handleCreateCustomGroup(req: Request, res: Response, cache?: CreateGroupPropertiesToData) {
    if (!cache) throw new Error(`This interaction requires cache to work`);
    const { body } = req;
    const { data } = body;
    const interactionId: string = body.message.interaction.id;
    const guild = res.locals.guild;

    if (isSelectionComplete(cache)) {
        await createGroup(
            guild.id,
            cache[CreateGroupProperties.name],
            cache[CreateGroupProperties.isOrdered] === 'true',
            cache[CreateGroupProperties.isPublic] === 'true'
        );

        return res.send({
            type: InteractionResponseType.UPDATE_MESSAGE,
            data: {
                content: `Group ${cache[CreateGroupProperties.name]} created with the following properties: isOrdered=${
                    cache[CreateGroupProperties.isOrdered]
                }; isPublic=${cache[CreateGroupProperties.isPublic]}`,
                components: [],
            },
        });
    } else {
        return res.send(respondWithAcknowledgement());
    }
}
