import { findCommandByName, hasCommandBeenChanged } from './commands';
import { logFailedRequestToDiscord } from './requestToDiscordAPI';
import { getGuildCommands, createGuildCommand, updateGuildCommand, deleteGuildCommand } from './guildCommands';
import { ApplicationCommand } from './types';

/**
 *
 * @throws Error
 */
export async function migrateGuildCommands(guildId: string, commands: ApplicationCommand[]) {
    try {
        const installedCommands = await getGuildCommands(guildId);
        console.log(
            `Installed commands on guild: ${guildId}`,
            installedCommands.map((c) => c.name)
        );

        // install or command if necessary
        for (const command of commands) {
            const installedCommand = findCommandByName(command.name, installedCommands);
            // check if command is installed
            if (installedCommand) {
                // check if command needs migration
                if (hasCommandBeenChanged(command, installedCommand)) {
                    // update command
                    await updateGuildCommand({ id: installedCommand.id, ...command }, guildId);
                }
            } else {
                console.log(`installing /${command.name} for guild: ${guildId}`);
                const newCommand = await createGuildCommand(command, guildId);
                installedCommands.push(newCommand);
            }
        }

        // delete orphaned commands
        for (const ic of installedCommands) {
            const localComponent = findCommandByName(ic.name, commands);
            if (!localComponent) {
                await deleteGuildCommand(ic.id, guildId);
            }
        }
    } catch (e) {
        logFailedRequestToDiscord(e);
        throw e;
    }
}

export default migrateGuildCommands;
