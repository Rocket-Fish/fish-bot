import { MenuComponent, createMenuComponent } from '..';

export function makeOperandMenu(): MenuComponent {
    return createMenuComponent({
        custom_id: 'select_operand',
        placeholder: 'What operand should be compared',
        options: [
            {
                label: 'Number of purple parses',
                value: 'number_purple_count',
                description: 'Number of purple encounters in zone',
            },
        ],
    });
}
