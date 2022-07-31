import { handleError } from './discordRequest';
import { getGuildCommands } from './guildCommands';
import { ApplicationCommand, ApplicationCommandTypes } from './types';

export const TEST_COMMAND: ApplicationCommand = {
    name: 'test',
    description: 'Check if fish-bot is alive',
    type: ApplicationCommandTypes.CHAT_INPUT,
};

export function findCommandByName(
    name: string,
    commands: ApplicationCommand[]
): ApplicationCommand | undefined {
    return commands.find((c) => c.name === name);
}

export async function initGuildCommands(
    guildId: string,
    commands: ApplicationCommand[]
) {
    try {
        const installedCommands = await getGuildCommands(guildId);
        console.log(installedCommands);

        commands.forEach((command) => {
            const installedCommand = findCommandByName(
                command.name,
                installedCommands
            );
            if (installedCommand) {
                // command installed
            } else {
            }
            // if installed check if version in code is the same as what is installed
            //
        });
    } catch (e) {
        handleError(e);
    }
}
