import { InteractionResponseType } from 'discord-interactions';
import { Request, Response } from 'express';
import { MenuComponent, createMenuComponent, SelectOption } from '.';
import { deleteRole } from '../../../models/Role';

export function makeDeleteRoleConfigMenu(options: SelectOption[]): MenuComponent {
    return createMenuComponent({
        custom_id: 'select_role_to_be_deleted',
        placeholder: 'Select role configuration to be deleted',
        options,
    });
}

export async function handleDeleteRoleSelection(req: Request, res: Response) {
    const { data } = req.body;

    const roleConfigToBeDeleted = data.values[0];

    await deleteRole(roleConfigToBeDeleted);

    return res.send({
        type: InteractionResponseType.UPDATE_MESSAGE,
        data: {
            content: 'Role configuration deleted',
            components: [],
        },
    });
}
