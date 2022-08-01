export enum ChannelTypes {
    GUILD_TEXT = 0, // a text channel within a server
    DM = 1, // a direct message between users
    GUILD_VOICE = 2, // a voice channel within a server
    GROUP_DM = 3, // a direct message between multiple users
    GUILD_CATEGORY = 4, // an organizational category that contains up to 50 channels
    GUILD_NEWS = 5, // a channel that users can follow and crosspost into their own server
    GUILD_NEWS_THREAD = 10, // a temporary sub-channel within a GUILD_NEWS channel
    GUILD_PUBLIC_THREAD = 11, // a temporary sub-channel within a GUILD_TEXT channel
    GUILD_PRIVATE_THREAD = 12, // a temporary sub-channel within a GUILD_TEXT channel that is only viewable by those invited and those with the MANAGE_THREADS permission
    GUILD_STAGE_VOICE = 13, // a voice channel for hosting events with an audience
    GUILD_DIRECTORY = 14, // the channel in a hub containing the listed servers
    GUILD_FORUM = 15, // (still in development) a channel that can only contain threads
}

export enum ApplicationCommandOptionTypes {
    SUB_COMMAND = 1,
    SUB_COMMAND_GROUP = 2,
    STRING = 3,
    INTEGER = 4, // Any integer between -2^53 and 2^53
    BOOLEAN = 5,
    USER = 6,
    CHANNEL = 7, // Includes all channel types + categories
    ROLE = 8,
    MENTIONABLE = 9, // Includes users and roles
    NUMBER = 10, // Any double between -2^53 and 2^53
    ATTACHMENT = 11, // attachment object
}

export type ApplicationCommandOptionChoice = {
    name: string;
    // name_localizations?: skipping localization
    value: string | number;
};

export type ApplicationCommandOption = {
    type: ApplicationCommandOptionTypes;
    name: string;
    // name_localizations?: skipping localization
    description: string;
    // description_localizations?: skipping localization
    required?: boolean;
    choices?: ApplicationCommandOptionChoice[];
    options?: ApplicationCommandOption[];
    channel_types?: ChannelTypes[];
    min_value?: number; // for INTEGER or NUMBER types
    max_value?: number; // for INTEGER or NUMBER types
    min_length?: number; // for STRING type
    max_length?: number; // for STRING type
    autocomplete?: boolean; // for STRING or INTEGER or NUMBER types
};

export enum ApplicationCommandTypes {
    CHAT_INPUT = 1, // Slash commands; a text-based command that shows up when a user types /
    USER = 2, // A UI-based command that shows up when you right click or tap on a user
    MESSAGE = 3, // A UI-based command that shows up when you right click or tap on a message
}

export type ApplicationCommand = {
    id?: string;
    type: ApplicationCommandTypes;
    application_id?: string;
    guild_id?: string;
    name: string;
    // name_localizations?: skipping localization
    description: string;
    // description_localizations?: skipping localization
    options?: ApplicationCommandOption[];
    default_member_permissions?: string; // see https://discord.com/developers/docs/topics/permissions
    dm_permission?: boolean; //Indicates whether the command is available in DMs with the app, only for globally-scoped commands. By default, commands are visible.
    version?: string; //Autoincrementing version identifier updated during substantial record changes
};

/**
 * this type is the same as ApplicationCommand except with a few params that are not optional
 */
export type ApplicationCommandResponse = ApplicationCommand & {
    id: string;
    application_id: string;
    default_member_permissions: string | null; // see https://discord.com/developers/docs/topics/permissions
    version: string; //Autoincrementing version identifier updated during substantial record changes
};

export type ApplicationCommandWithMandatoryId = ApplicationCommand | { id: string };
