import { InteractionResponseType } from 'discord-interactions';

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

export function responseToDiscord(
    title: string,
    description: string,
    status: Status = Status.success,
    allowedMentions: ('roles' | 'users' | 'everyone')[] = [],
    otherOptions?: any
) {
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
            ...otherOptions,
        },
    };
}

export default responseToDiscord;
