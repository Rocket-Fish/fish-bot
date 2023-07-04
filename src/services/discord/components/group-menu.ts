import { Request, Response } from 'express';
import {
    createMenuComponent,
    CachedInteractiveComponent,
    createActionRowComponent,
    createButtonComponent,
    ComponentButtonStyles,
    SelectOption,
} from '.';
import { InteractionResponseType } from 'discord-interactions';
import { Group, createGroup, getGroup, updateGroup } from '../../../models/Group';
import { respondWithAcknowledgement, respondWithInteractiveComponent } from '../respondToInteraction';

export const CREATE_GROUP = 'CreateGroup';
export const createGroupMenu = new CachedInteractiveComponent<CreateGroupPropertiesToData>(
    CREATE_GROUP,
    generateCreateInteraction,
    handleCreateCustomGroup
);

function generateCreateInteraction() {
    return respondWithInteractiveComponent('Select Options for Group', [
        createActionRowComponent([makeOrderMenu()]),
        createActionRowComponent([makePublicityMenu()]),
    ]);
}

function makeOrderMenu(custom_id = CreateGroupProperties.isOrdered as string, defaultSelection?: boolean) {
    return createMenuComponent({
        custom_id,
        placeholder: 'Does ordering matter in this group?',
        options: [
            {
                label: 'Ordered',
                value: `true`,
                default: defaultSelection === true,
            },
            {
                label: 'Unordered',
                value: `false`,
                default: defaultSelection === false,
            },
        ],
    });
}

function makePublicityMenu(custom_id = CreateGroupProperties.isPublic as string, defaultSelection?: boolean) {
    return createMenuComponent({
        custom_id,
        placeholder: 'Allow or disallow non-admin users to modify themselves?',
        options: [
            {
                label: 'Public',
                value: `true`,
                default: defaultSelection === true,
            },
            {
                label: 'Private',
                value: `false`,
                default: defaultSelection === false,
            },
        ],
    });
}

function isSelectionComplete(value: CreateGroupPropertiesToData) {
    return value[CreateGroupProperties.isPublic] && value[CreateGroupProperties.isOrdered];
}

async function handleCreateCustomGroup(
    t: CachedInteractiveComponent<CreateGroupPropertiesToData>,
    req: Request,
    res: Response,
    cache: CreateGroupPropertiesToData
) {
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

/////////////////////////////////////////////////

export const EDIT_GROUP = 'EditGroup';
export const editGroupMenu = new CachedInteractiveComponent<EditGroupPropertiesToData>(
    EDIT_GROUP,
    generateInitialEditInteraction,
    handleEditCustomGroup
);

function generateInitialEditInteraction(options?: SelectOption[][]) {
    if (!options) throw new Error(`Improperly configured ${EDIT_GROUP} menu, options not defined`);
    return respondWithInteractiveComponent('Select group to edit', [
        createActionRowComponent([
            createMenuComponent({
                custom_id: EditGroupProperties.id,
                placeholder: 'Select role group to be edited',
                options: options[0],
            }),
        ]),
    ]);
}

function generateFollowupEditInteraction(name: string, group: Group) {
    return respondWithInteractiveComponent(
        `Editing group: ${name}; Make the changes then press save to save, and press cancel to discard changes`,
        [
            createActionRowComponent([makeOrderMenu(EditGroupProperties.isOrdered, group.is_ordered)]),
            createActionRowComponent([makePublicityMenu(EditGroupProperties.isPublic, group.is_public)]),
            createActionRowComponent([
                createButtonComponent({
                    custom_id: EditGroupProperties.cancelButton,
                    style: ComponentButtonStyles.secondary,
                    label: 'Cancel',
                }),
                createButtonComponent({
                    custom_id: EditGroupProperties.saveButton,
                    style: ComponentButtonStyles.primary,
                    label: 'Save',
                }),
            ]),
        ],
        {
            interactionResponseType: InteractionResponseType.UPDATE_MESSAGE,
        }
    );
}

export enum CreateGroupProperties {
    name = 'create-group_name',
    isPublic = 'create-group_select-publicity',
    isOrdered = 'create-group_select-order',
}

export type CreateGroupPropertiesToData = {
    [k in CreateGroupProperties]: string;
};

export enum EditGroupProperties {
    id = 'edit-group_id',
    isPublic = 'edit-group_select-publicity',
    isOrdered = 'edit-group_select-order',
    saveButton = 'edit-group_save',
    cancelButton = 'edit-group_cancel',
}

export type EditGroupPropertiesToData = {
    [k in EditGroupProperties]: string;
};

async function handleEditCustomGroup(
    t: CachedInteractiveComponent<EditGroupPropertiesToData>,
    req: Request,
    res: Response,
    cache: EditGroupPropertiesToData,
    prevCache: EditGroupPropertiesToData
) {
    const { body } = req;
    const interactionId: string = body.message.interaction.id;
    const group = await getGroup(cache[EditGroupProperties.id]);
    if (!group) {
        // this should almost be impossible to trigger, if this triggers then something is wrong
        throw new Error('Improperly setup handle Edit custom group, need to select group first before handling anything else');
    }
    if (prevCache[EditGroupProperties.id] !== cache[EditGroupProperties.id]) {
        await t.setCache(interactionId, {
            ...cache,
            [EditGroupProperties.isOrdered]: String(group.is_ordered),
            [EditGroupProperties.isPublic]: String(group.is_public),
        });
        return res.send(generateFollowupEditInteraction(group.name, group));
    }
    if (prevCache[EditGroupProperties.saveButton] !== cache[EditGroupProperties.saveButton]) {
        await updateGroup(
            cache[EditGroupProperties.id],
            cache[EditGroupProperties.isOrdered] === 'true',
            cache[EditGroupProperties.isPublic] === 'true'
        );
        return res.send({
            type: InteractionResponseType.UPDATE_MESSAGE,
            data: {
                content: `Group ${group.name} has been updated to the following properties: isOrdered=${
                    cache[EditGroupProperties.isOrdered]
                }; isPublic=${cache[EditGroupProperties.isPublic]}`,
                components: [],
            },
        });
    }
    if (prevCache[EditGroupProperties.cancelButton] !== cache[EditGroupProperties.cancelButton]) {
        return res.send({
            type: InteractionResponseType.UPDATE_MESSAGE,
            data: {
                content: `Group ${group.name} has not been changed. It is still has the following properties: isOrdered=${group.is_ordered}; isPublic=${group.is_public}`,
                components: [],
            },
        });
    }

    return res.send(respondWithAcknowledgement());
}
