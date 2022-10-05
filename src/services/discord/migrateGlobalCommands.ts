import { findCommandByName, hasCommandBeenChanged } from './commands';
import { logFailedRequestToDiscord } from './requestToDiscordAPI';
import { createGlobalCommand, deleteGlobalCommand, getGlobalCommands, updateGlobalCommand } from './globalCommands';
import { ApplicationCommand } from './types';

/**
 *
 * @throws Error
 */
export async function migrateGlobalComands(commands: ApplicationCommand[]) {
    try {
        const installedCommands = await getGlobalCommands();
        console.log(
            `Installed global commands`,
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
                    await updateGlobalCommand({ id: installedCommand.id, ...command });
                }
            } else {
                console.log(`installing /${command.name} globally`);
                const newCommand = await createGlobalCommand(command);
                installedCommands.push(newCommand);
            }
        }

        // delete orphaned commands
        for (const ic of installedCommands) {
            const localComponent = findCommandByName(ic.name, commands);
            if (!localComponent) {
                await deleteGlobalCommand(ic.id);
            }
        }
    } catch (e) {
        logFailedRequestToDiscord(e);
        throw e;
    }
}

export default migrateGlobalComands;
