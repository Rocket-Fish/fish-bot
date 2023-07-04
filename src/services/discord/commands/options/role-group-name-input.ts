import { ApplicationCommandOption, ApplicationCommandOptionTypes } from '../../types';

export const groupNameInput: ApplicationCommandOption = {
    name: 'name',
    description: 'What sort of condition should be rquired to give out this role',
    required: true,
    type: ApplicationCommandOptionTypes.STRING,
    min_length: 1,
};

export const groupCustomize: ApplicationCommandOption = {
    name: 'customize',
    description: 'if customize is not set, the command will create a Private Unordered group (default)',
    required: false,
    type: ApplicationCommandOptionTypes.BOOLEAN,
};
