import { InteractionResponseType } from 'discord-interactions';
import { Request, Response } from 'express';
import { ApplicationCommand, ApplicationCommandTypes } from '../types';

export const test: ApplicationCommand = {
    name: 'test',
    description: 'Check if FishBot is alive',
    type: ApplicationCommandTypes.CHAT_INPUT,
};

export function handleTest(req: Request, res: Response) {
    return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: { content: 'I am alive' },
    });
}
