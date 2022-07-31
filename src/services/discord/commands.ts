import { handleError } from './discordRequest';
import { createGuildCommand, getGuildCommands } from './guildCommands';
import { ApplicationCommand, ApplicationCommandTypes } from './types';

export const PING: ApplicationCommand = {
    name: 'ping',
    description: 'Check if FishBot is alive',
    type: ApplicationCommandTypes.CHAT_INPUT,
};

export function findCommandByName(
    name: string,
    commands: ApplicationCommand[]
): ApplicationCommand | undefined {
    return commands.find((c) => c.name === name);
}

export function hasCommandBeenChanged(
    ourCommand: ApplicationCommand,
    theirCommand: ApplicationCommand
): boolean {
    return !(
        ourCommand.name === theirCommand.name &&
        ourCommand.description === theirCommand.description &&
        ourCommand.type === theirCommand.type
    );
}
