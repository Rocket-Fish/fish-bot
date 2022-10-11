import { ApplicationCommandOption, ApplicationCommandOptionTypes } from '../../types';

export const roleGroupNameInput: ApplicationCommandOption = {
    name: 'name',
    description: 'What sort of condition should be rquired to give out this role',
    required: true,
    type: ApplicationCommandOptionTypes.STRING,
    min_length: 1,
};
