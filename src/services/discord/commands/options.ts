import { ApplicationCommandOption, ApplicationCommandOptionTypes } from '../types';
import { ApplicationCommandOptionWSubCommand, ApplicationCommandOptionWSubCommandGroup } from './types';

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

export const encounter: ApplicationCommandOption = {
    name: 'encounter-id',
    description: 'the id of the encounter',
    required: true,
    type: ApplicationCommandOptionTypes.INTEGER,
    choices: [
        {
            name: `TODO: Some Encounter`,
            value: 1,
        },
    ],
};

export const encounterId: ApplicationCommandOption = {
    name: 'encounter-id',
    description: 'the id of the encounter',
    required: true,
    type: ApplicationCommandOptionTypes.INTEGER,
    min_value: 0,
    max_value: 1000,
};

// Comparison Section
export enum Comparisons {
    greaterThan = 'greater-than',
}

export const greaterThan: ApplicationCommandOptionWSubCommand = {
    name: Comparisons.greaterThan,
    description: 'with a condition greater than',
    type: ApplicationCommandOptionTypes.SUB_COMMAND,
    options: [
        role,
        zone,
        {
            name: Comparisons.greaterThan,
            description: 'greater than this number',
            type: ApplicationCommandOptionTypes.NUMBER,
            required: true,
        },
    ],
};

// conditions section
export enum Conditions {
    purpleCount = 'purple-count',
}

export const purpleCount: ApplicationCommandOptionWSubCommandGroup = {
    name: Conditions.purpleCount,
    description: 'number of encounters in this zone ranked purple or higher',
    type: ApplicationCommandOptionTypes.SUB_COMMAND_GROUP,
    options: [greaterThan],
};
