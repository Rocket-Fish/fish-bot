import { Request, Response } from 'express';
import { ApplicationCommand, ApplicationCommandTypes } from '../types';
import { condition } from './options';
import util from 'util';
import { InteractionResponseType } from 'discord-interactions';

export const CONFIGURE_ROLE_BY_ZONE: ApplicationCommand = {
    name: 'configure-role-by-zone',
    description: 'Configures the condition of giving out a specific role in this server, based on fflogs zone',
    type: ApplicationCommandTypes.CHAT_INPUT,
    options: [condition.purpleCount],
    default_member_permissions: '0', // default to disable for everyone except server admins
};

export function handleConfigureRoleByZone(req: Request, res: Response) {
    const { data } = req.body;

    console.log(
        util.inspect(data, {
            showHidden: false,
            depth: null,
            colors: true,
        })
    );

    return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: { content: 'TODO: configure role' },
    });
}
