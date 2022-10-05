import { MenuComponent, createMenuComponent } from '.';

export function makeConditionMenu(): MenuComponent {
    return createMenuComponent({
        custom_id: 'select_condition',
        placeholder: 'Under what condition should the operand be subjected to?',
        options: [
            {
                label: 'Greater than 3',
                value: 'greater_than_3',
                description: 'Operand must be greater than three',
            },
        ],
    });
}
