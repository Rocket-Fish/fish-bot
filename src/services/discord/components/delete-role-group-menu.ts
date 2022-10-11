import { InteractionResponseType } from 'discord-interactions';
import { Request, Response } from 'express';
import { SelectOption, MenuComponent, createMenuComponent } from '.';
import { deleteRoleGroup } from '../../../models/RoleGroup';

export function makeDeleteRoleGroupMenu(options: SelectOption[]): MenuComponent {
    return createMenuComponent({
        custom_id: 'select_role_group_to_be_deleted',
        placeholder: 'Select role group to be deleted',
        options,
    });
}

export async function handleDeleteRoleGroupSelection(req: Request, res: Response) {
    const { data } = req.body;

    const roleGroupToBeDeleted = data.values[0];

    await deleteRoleGroup(roleGroupToBeDeleted);

    return res.send({
        type: InteractionResponseType.UPDATE_MESSAGE,
        data: {
            content: 'Role group deleted',
            components: [],
        },
    });
}
