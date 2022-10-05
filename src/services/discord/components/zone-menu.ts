import { Request, Response } from 'express';
import { MenuComponent, createMenuComponent, ComponentType } from '.';
import { respondWithInteractionUpdate } from '../respondToInteraction';

export function makeZoneMenu(): MenuComponent {
    return createMenuComponent({
        custom_id: 'select_zone',
        placeholder: 'In What Zone?',
        max_values: 1,
        min_values: 1,
        options: [
            {
                label: 'Abyssos Savage',
                value: '49-savage',
                description: 'p5s-p8s',
            },
            {
                label: 'Asphodelos Savage',
                value: '44-savage',
                description: 'p1s - p4s',
            },
        ],
    });
}

export type ExpectedBodyData = {
    component_type: ComponentType.selectMenu;
    custom_id: string; // TODO: this should be ZONE_MENU_ID exclusively
    values: string[];
};

export async function handleZoneMenuInteraction(req: Request, res: Response) {
    const data: ExpectedBodyData = req.body.data;
    const content = req.body.message.content;

    return res.send(respondWithInteractionUpdate(''));
}
