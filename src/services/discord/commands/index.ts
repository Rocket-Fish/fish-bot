import { ApplicationCommand, ApplicationCommandOption } from '../types';

export function findCommandByName(name: string, commands: ApplicationCommand[]): ApplicationCommand | undefined {
    return commands.find((c) => c.name === name);
}

function findCommandOptionByName(name: string, commands: ApplicationCommandOption[]): ApplicationCommandOption | undefined {
    return commands.find((c) => c.name === name);
}

function hasCommandOptionBeenChanged(ourOptions?: ApplicationCommandOption[], theirOptions?: ApplicationCommandOption[]): boolean {
    if (ourOptions && theirOptions) {
        let hasChanged = false;

        ourOptions.forEach((o) => {
            if (hasChanged) return;
            const t = findCommandOptionByName(o.name, theirOptions);
            if (
                t &&
                o.type === t.type &&
                // name not needed, the above search is by name;
                o.description === t.description &&
                o.required === t.required &&
                JSON.stringify(o.choices || '') === JSON.stringify(t.choices || '') &&
                o.channel_types === t.channel_types &&
                o.min_length === t.min_length &&
                o.max_length === t.max_length &&
                o.min_value === t.min_value &&
                o.max_value === t.max_value &&
                o.autocomplete === t.autocomplete &&
                !hasCommandOptionBeenChanged(o.options, t.options)
            ) {
                // do nothing cuz nothing changed
            } else {
                hasChanged = true;
            }
        });

        return hasChanged;
    } else if (!ourOptions && theirOptions) return true;
    else if (ourOptions && !theirOptions) return true;
    else {
        return false;
    }
}

export function hasCommandBeenChanged(ourCommand: ApplicationCommand, theirCommand: ApplicationCommand): boolean {
    return (
        !(ourCommand.name === theirCommand.name && ourCommand.description === theirCommand.description && ourCommand.type === theirCommand.type) ||
        hasCommandOptionBeenChanged(ourCommand.options, theirCommand.options)
    );
}
