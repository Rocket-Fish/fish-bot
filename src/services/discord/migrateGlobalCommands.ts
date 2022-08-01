import { findCommandByName, hasCommandBeenChanged } from './commands';
import { handleError } from './discordRequest';
import { createGlobalCommand, deleteGlobalCommand, getGlobalCommands, updateGlobalCommand } from './globalCommands';
import { ApplicationCommand } from './types';

export async function migrateGlobalComands(commands: ApplicationCommand[]) {
    try {
        const installedCommands = await getGlobalCommands();
        console.log(
            `Installed global commands`,
            installedCommands.map((c) => c.name)
        );

        // install or command if necessary
        commands.forEach(async (command) => {
            try {
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
            } catch (e) {
                handleError(e);
            }
        });

        // delete orphaned commands
        installedCommands.forEach(async (ic) => {
            try {
                const localComponent = findCommandByName(ic.name, commands);
                if (!localComponent) {
                    await deleteGlobalCommand(ic.id);
                }
            } catch (e) {
                handleError(e);
            }
        });
    } catch (e) {
        handleError(e);
    }
}

export default migrateGlobalComands;
