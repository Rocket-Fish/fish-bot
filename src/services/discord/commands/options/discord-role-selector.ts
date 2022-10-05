import { ApplicationCommandOption, ApplicationCommandOptionTypes } from '../../types';

export const discordRoleSelector: ApplicationCommandOption = {
    name: 'role',
    description: 'Role to be given out',
    required: true,
    type: ApplicationCommandOptionTypes.ROLE,
};
