import { Request, Response } from 'express';
import { SelectOption, MenuComponent, createMenuComponent } from '.';
import { respondWithAcknowledgement } from '../respondToInteraction';
import util from 'util';

export function makeAddRoleToGroupMenu1(options: SelectOption[]): MenuComponent {
    return createMenuComponent({
        custom_id: 'add-role-to-group_select-role',
        placeholder: 'Select role configuration to be added to a role group',
        options,
    });
}

export function makeAddRoleToGroupMenu2(options: SelectOption[]): MenuComponent {
    return createMenuComponent({
        custom_id: 'add-role-to-group_select-group',
        placeholder: 'Select role group to receive the above role configuration',
        options,
    });
}

export async function handleAddRoleToGroup(req: Request, res: Response) {
    const { body } = req;

    console.log('body', body);
    console.log(
        'body.message.components',
        util.inspect(body.message.components, {
            showHidden: false,
            depth: null,
            colors: true,
        })
    );

    // TODO: redis cache the responses and when proper format is filled out, then create the proper entry in database
    // TODO: use key "addRoleToGroup-${body.message.id}"
    return res.send(respondWithAcknowledgement());
}
