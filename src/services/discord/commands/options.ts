import { ApplicationCommandOption, ApplicationCommandOptionTypes } from '../types';

export const role: ApplicationCommandOption = {
    name: 'role',
    description: 'Role to be given out',
    required: true,
    type: ApplicationCommandOptionTypes.ROLE,
};

export const zone: ApplicationCommandOption = {
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
export const zoneId: ApplicationCommandOption = {
    name: 'zone-id',
    description: 'id of the raid zone',
    required: true,
    type: ApplicationCommandOptionTypes.INTEGER,
    min_value: 0,
};

export const encounterId: ApplicationCommandOption = {
    name: 'encounter-id',
    description: 'the id of the encounter',
    required: true,
    type: ApplicationCommandOptionTypes.INTEGER,
    min_value: 0,
    max_value: 1000,
};

export type ApplicationCommandOptionWSubCommand = ApplicationCommandOption & {
    type: ApplicationCommandOptionTypes.SUB_COMMAND;
};

const greaterThan: ApplicationCommandOptionWSubCommand = {
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
};

export const comparison = {
    greaterThan,
};

export type ApplicationCommandOptionWSubCommandGroup = ApplicationCommandOption & {
    type: ApplicationCommandOptionTypes.SUB_COMMAND_GROUP;
};

const purpleCount: ApplicationCommandOptionWSubCommandGroup = {
    name: 'purple-count',
    description: 'number of encounters in this zone ranked purple or higher',
    type: ApplicationCommandOptionTypes.SUB_COMMAND_GROUP,
    options: [comparison.greaterThan],
};

export const condition = {
    purpleCount,
};
