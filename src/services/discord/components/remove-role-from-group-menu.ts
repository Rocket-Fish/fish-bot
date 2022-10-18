import { InteractionResponseType } from 'discord-interactions';
import { Request, Response } from 'express';
import { SelectOption, MenuComponent, createMenuComponent } from '.';
import { removeRoleFromAllGroups } from '../../../models/Role';

export function makeRemoveRoleFromGroupMenu(options: SelectOption[]): MenuComponent {
    return createMenuComponent({
        custom_id: 'select_role_to_be_removed_from_group',
        placeholder: 'Select role config to be removed from role group',
        options,
    });
}

export async function handleRemoveRoleFromGroupMenu(req: Request, res: Response) {
    const { data } = req.body;

    const roleToRemoveFromRoleGroup = data.values[0];

    await removeRoleFromAllGroups(roleToRemoveFromRoleGroup);

    return res.send({
        type: InteractionResponseType.UPDATE_MESSAGE,
        data: {
            content: 'Role configuration removed from group',
            components: [],
        },
    });
}
