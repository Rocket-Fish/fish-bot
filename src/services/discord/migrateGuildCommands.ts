import { findCommandByName, hasCommandBeenChanged } from './commands';
import { handleError } from './discordRequest';
import {
    getGuildCommands,
    createGuildCommand,
    updateGuildCommand,
    deleteGuildCommand,
} from './guildCommands';
import { ApplicationCommand } from './types';

export async function migrateGuildCommands(
    guildId: string,
    commands: ApplicationCommand[]
) {
    try {
        const installedCommands = await getGuildCommands(guildId);
        console.log(
            `Installed commands on guild:${guildId}`,
            installedCommands.map((c) => c.name)
        );

        // install or command if necessary
        commands.forEach(async (command) => {
            try {
                const installedCommand = findCommandByName(
                    command.name,
                    installedCommands
                );
                // check if command is installed
                if (installedCommand) {
                    // check if command needs migration
                    if (hasCommandBeenChanged(command, installedCommand)) {
                        // update command
                        await updateGuildCommand(
                            { id: installedCommand.id, ...command },
                            guildId
                        );
                    }
                } else {
                    console.log(
                        `installing /${command.name} for guild:${guildId}`
                    );
                    const newCommand = await createGuildCommand(
                        command,
                        guildId
                    );
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
                    await deleteGuildCommand(ic.id, guildId);
                }
            } catch (e) {
                handleError(e);
            }
        });
    } catch (e) {
        handleError(e);
    }
}

export default migrateGuildCommands;
