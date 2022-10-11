import { InteractionResponseFlags, InteractionResponseType } from 'discord-interactions';
import { Component } from './components';

export enum Status {
    success = 'success',
    failure = 'failure',
    warning = 'warning',
    info = 'info',
}

type StatusToColor = {
    [k in Status]: number;
};

const statusToColor: StatusToColor = {
    [Status.success]: 0x00ff00,
    [Status.failure]: 0xff0000,
    [Status.warning]: 0xffa500,
    [Status.info]: 0xeaeaea,
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

export function respondWithInteractiveComponent(
    message: string,
    components: Component[],
    ephemeral: boolean = true,
    allowedMentions: AllowedMention[] = []
): InteractionResponse {
    return {
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
            ...(ephemeral && { flags: InteractionResponseFlags.EPHEMERAL }),
            components,
            content: message,
            allowed_mentions: {
                parse: allowedMentions,
            },
        },
    };
}

export function respondWithInteractionUpdate(content: string): InteractionResponse {
    return {
        type: InteractionResponseType.UPDATE_MESSAGE,
        data: {
            content,
        },
    };
}

export function respondWithAcknowledgement(): InteractionResponse {
    return {
        type: InteractionResponseType.DEFERRED_UPDATE_MESSAGE,
    };
}
