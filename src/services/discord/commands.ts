import {
    ApplicationCommand,
    ApplicationCommandOption,
    ApplicationCommandOptionTypes,
    ApplicationCommandTypes,
} from './types';

export const TEST: ApplicationCommand = {
    name: 'test',
    description: 'Check if FishBot is alive',
    type: ApplicationCommandTypes.CHAT_INPUT,
};

const role: ApplicationCommandOption = {
    name: 'role',
    description: 'Role to be given out',
    required: true,
    type: ApplicationCommandOptionTypes.ROLE,
};

const zone: ApplicationCommandOption = {
    name: 'zone',
    description: 'The raid zone',
    required: true,
    type: ApplicationCommandOptionTypes.INTEGER,
    choices: [
        {
            name: `Asphodelos - 44`,
            value: 44,
        },
    ],
};
const zoneId: ApplicationCommandOption = {
    name: 'zone-id',
    description: 'id of the raid zone',
    required: true,
    type: ApplicationCommandOptionTypes.INTEGER,
    min_value: 0,
};

const encounterId: ApplicationCommandOption = {
    name: 'encounter-id',
    description: 'the id of the encounter',
    required: true,
    type: ApplicationCommandOptionTypes.INTEGER,
    min_value: 0,
    max_value: 1000,
};

const condition: {
    [k: string]: ApplicationCommandOption & {
        type: ApplicationCommandOptionTypes.SUB_COMMAND;
    };
} = {
    greaterThan: {
        name: 'greater-than',
        description: 'with a condition greater than',
        type: ApplicationCommandOptionTypes.SUB_COMMAND,
        options: [
            role,
            zone,
            {
                name: 'greater-than',
                description: 'greater than this number',
                type: ApplicationCommandOptionTypes.NUMBER,
                required: true,
            },
        ],
    },
};

export const CONFIGURE_ROLE_BY_ZONE: ApplicationCommand = {
    name: 'configure-role-by-zone',
    description:
        'Configures the condition of giving out a specific role in this server, based on fflogs zone',
    type: ApplicationCommandTypes.CHAT_INPUT,
    options: [
        {
            name: 'purple-count',
            description:
                'number of encounters in this zone ranked purple or higher',
            type: ApplicationCommandOptionTypes.SUB_COMMAND_GROUP,
            options: [condition.greaterThan],
        },
    ],
};

export function findCommandByName(
    name: string,
    commands: ApplicationCommand[]
): ApplicationCommand | undefined {
    return commands.find((c) => c.name === name);
}

function findCommandOptionByName(
    name: string,
    commands: ApplicationCommandOption[]
): ApplicationCommandOption | undefined {
    return commands.find((c) => c.name === name);
}

function hasCommandOptionBeenChanged(
    ourOptions?: ApplicationCommandOption[],
    theirOptions?: ApplicationCommandOption[]
): boolean {
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
                JSON.stringify(o.choices || '') ===
                    JSON.stringify(t.choices || '') &&
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

export function hasCommandBeenChanged(
    ourCommand: ApplicationCommand,
    theirCommand: ApplicationCommand
): boolean {
    return (
        !(
            ourCommand.name === theirCommand.name &&
            ourCommand.description === theirCommand.description &&
            ourCommand.type === theirCommand.type
        ) ||
        hasCommandOptionBeenChanged(ourCommand.options, theirCommand.options)
    );
}
