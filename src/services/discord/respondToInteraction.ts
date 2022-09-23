import { InteractionResponseFlags, InteractionResponseType } from 'discord-interactions';

export enum Status {
    success = 'success',
    failure = 'failure',
    warning = 'warning',
}

type StatusToColor = {
    [k in Status]: number;
};

const statusToColor: StatusToColor = {
    [Status.success]: 0x00ff00,
    [Status.failure]: 0xff0000,
    [Status.warning]: 0xffa500,
};

export type Embeds = {
    title?: string;
    type?: string; // type of embed (always "rich" for webhook embeds)
    description?: string;
    url?: string;
    timestamp?: string; // ISO8601 timestamp
    color?: number; // color code of the embed
    footer?: {
        text: string;
        icon_url?: string;
        proxy_icon_url?: string;
    };
    image?: {
        url: string;
        proxy_url?: string;
        height?: number;
        width?: number;
    };
    thumbnail?: {
        url?: string;
        proxy_url?: string;
        height?: number;
        width?: number;
    };
    video?: {
        url?: string;
        proxy_url?: string;
        height?: number;
        width?: number;
    };
    provider?: {
        name?: string;
        url?: string;
    };
    author?: {
        name: string;
        url?: string;
        icon_url?: string;
        proxy_icon_url?: string;
    };
    fields?: {
        name: string;
        value: string;
        inline?: boolean;
    }[];
};

export type AllowedMention = 'roles' | 'users' | 'everyone';

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

export type ComponentButton = {
    type: ComponentType.button;
    style: ComponentButtonStyles;
    custom_id?: string; // required for most styles
    url?: string; // required for the link style
    label?: string; // max 80 chars
    emoji?: Emoji;
    disabled?: boolean;
};

export type SelectOptions = {
    label: string;
    value: string;
    description?: string;
    emoji?: Emoji;
    default?: boolean;
};

export type ComponentMenu = {
    type: ComponentType.selectMenu;
    custom_id: string;
    options: SelectOptions[]; // 25 max
    placeholder?: string;
    min_values?: number; // min number chosen; default 1, min 0, max 25
    max_values?: number; // maximum number of items that can be chosen; default 1, max 25
    disabled?: boolean;
};

export type ComponentActionRow = {
    type: ComponentType.actionRow;
    components?: (ComponentButton | ComponentMenu)[];
};

export type Component = ComponentActionRow & {
    components?: (ComponentButton | ComponentMenu | ComponentActionRow)[];
};

export type Attachment = {
    id: string; // snowflake
    filename: string;
    description?: string;
    content_type?: string; // media type
    size: number; // size ni bytes
    url: string;
    proxy_url: string;
    height?: number; // if image
    width?: number; // if image
    ephemeral?: boolean; // will be removed after a period of time. guarenteed to exist as long as message doesn't get deleted
};

/**
 * see https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-response-object-messages
 */
export type InteractionResponseMessage = {
    tts?: boolean;
    content?: string; // message content
    embeds?: Embeds[];
    allowed_mentions?: {
        parse?: AllowedMention[];
        roles?: string[]; // list of snowflakes
        users?: string[]; // list of snowflakes
        replied_user?: boolean; // For replies, whether to mention the author of the message being replied to (default false)
    };
    flags?: InteractionResponseFlags;
    components?: Component[];
    attachments?: Attachment[];
};

/**
 * see https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-response-object
 */
export type InteractionResponse = {
    type: InteractionResponseType;
    data?: InteractionResponseMessage;
};

/**
 * Create a response to discord. This function should be used to create a response message
 *
 * @returns Discord Message Object see: https://discord.com/developers/docs/resources/channel#message-object
 */
export function respondWithMessageInEmbed(
    title: string,
    description: string,
    status: Status = Status.success,
    allowedMentions: AllowedMention[] = []
): InteractionResponse {
    return {
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
            embeds: [
                {
                    title,
                    description,
                    color: statusToColor[status],
                },
            ],
            allowed_mentions: {
                parse: allowedMentions,
            },
        },
    };
}

export function respondWithInteractiveComponent(components: Component[], allowedMentions: AllowedMention[] = []): InteractionResponse {
    return {
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
            flags: InteractionResponseFlags.EPHEMERAL,
            components,
            allowed_mentions: {
                parse: allowedMentions,
            },
        },
    };
}
