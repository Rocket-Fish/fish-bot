import { InteractionResponseType } from 'discord-interactions';
import { Request, Response } from 'express';
import { SelectOption, createMenuComponent, CachedInteractiveComponent, createActionRowComponent, MenuComponent } from '.';
import { createRoleGroupWithPriority } from '../../../models/RoleGroupWithPriority';
import { respondWithAcknowledgement, respondWithInteractiveComponent } from '../respondToInteraction';

export const ADD_ROLE_2_GROUP = 'addRole2Group';

export const addRole2GroupMenu = new CachedInteractiveComponent<AddRole2GroupPropertiesToData>(
    ADD_ROLE_2_GROUP,
    generateInteraction,
    handleAddRoleToGroup
);

// TODO:  SelectOption[][] is confusing on which option is 0 and which option is 1, so this could be refactored to be better
function generateInteraction(options?: SelectOption[][]) {
    if (!options) throw new Error(`Improperly configured ${ADD_ROLE_2_GROUP} menu, options not defined`);
    return respondWithInteractiveComponent('Select a role and select a role group to add the role to', [
        createActionRowComponent([makeRoleMenu(options[0])]),
        createActionRowComponent([makeGroupMenu(options[1])]),
    ]);
}

function makeRoleMenu(options: SelectOption[]): MenuComponent {
    return createMenuComponent({
        custom_id: AddRole2GroupProperties.roleMenu,
        placeholder: 'Select role configuration to be added to a role group',
        options,
    });
}

function makeGroupMenu(options: SelectOption[]): MenuComponent {
    return createMenuComponent({
        custom_id: AddRole2GroupProperties.groupMenu,
        placeholder: 'Select role group to receive the above role configuration',
        options,
    });
}

export enum AddRole2GroupProperties {
    roleMenu = 'add-role-to-group_select-role',
    groupMenu = 'add-role-to-group_select-group',
}

export type AddRole2GroupPropertiesToData = {
    [k in AddRole2GroupProperties]: string;
};

function isSelectionComplete(value: AddRole2GroupPropertiesToData) {
    return value[AddRole2GroupProperties.roleMenu] && value[AddRole2GroupProperties.groupMenu];
}

async function handleAddRoleToGroup(
    t: CachedInteractiveComponent<AddRole2GroupPropertiesToData>,
    req: Request,
    res: Response,
    cache: AddRole2GroupPropertiesToData
) {
    if (isSelectionComplete(cache)) {
        await createRoleGroupWithPriority(cache[AddRole2GroupProperties.roleMenu], cache[AddRole2GroupProperties.groupMenu]);

        return res.send({
            type: InteractionResponseType.UPDATE_MESSAGE,
            data: {
                content: 'Role configuration added to selected group',
                components: [],
            },
        });
    } else {
        return res.send(respondWithAcknowledgement());
    }
}
