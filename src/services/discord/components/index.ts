export enum ComponentType {
    actionRow = 1,
    button = 2,
    selectMenu = 3,
    textInput = 4,
}

export enum ComponentButtonStyles {
    primary = 1, // blurple, requires custom_id
    secondary = 2, // grey, requires custom_id
    success = 3, // green, requires custom_id
    danger = 4, // red, requires custom_id
    link = 5, // grey, requires url
}

export type Emoji = {
    id: string | null; // snowflake for custom discord emojies, null for standard emojies
    name: string | null; // can be null only in reaction emoji objects
    roles?: string[];
    user?: any;
    require_colons?: boolean;
    manage?: boolean;
    animated?: boolean;
    available?: boolean;
};

export type ButtonComponentFragment = {
    style: ComponentButtonStyles;
    custom_id?: string; // required for most styles
    url?: string; // required for the link style
    label?: string; // max 80 chars
    emoji?: Emoji;
    disabled?: boolean;
};

export type ButtonComponent = ButtonComponentFragment & {
    type: ComponentType.button;
};

export type SelectOption = {
    label: string;
    value: string;
    description?: string;
    emoji?: Emoji;
    default?: boolean;
};

export type MenuComponentFragment = {
    custom_id: string;
    options: SelectOption[]; // 25 max
    placeholder?: string;
    min_values?: number; // min number chosen; default 1, min 0, max 25
    max_values?: number; // maximum number of items that can be chosen; default 1, max 25
    disabled?: boolean;
};

export type MenuComponent = MenuComponentFragment & {
    type: ComponentType.selectMenu;
};

export type ActionRowComponent = {
    type: ComponentType.actionRow;
    components: [MenuComponent] | ButtonComponent[];
};

export type Component = ActionRowComponent & {
    components: [MenuComponent] | ButtonComponent[] | ActionRowComponent[];
};

export function createButtonComponent(options: ButtonComponentFragment): ButtonComponent {
    return {
        type: ComponentType.button,
        ...options,
    };
}

export function createMenuComponent(options: MenuComponentFragment): MenuComponent {
    return {
        type: ComponentType.selectMenu,
        ...options,
    };
}

export function createActionRowComponent(components: [MenuComponent] | ButtonComponent[]): ActionRowComponent {
    return {
        type: ComponentType.actionRow,
        components,
    };
}
