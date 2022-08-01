import { ApplicationCommandOption, ApplicationCommandOptionTypes } from '../types';

export type ApplicationCommandOptionWSubCommand = ApplicationCommandOption & {
    type: ApplicationCommandOptionTypes.SUB_COMMAND;
};
export type ApplicationCommandOptionWSubCommandGroup = ApplicationCommandOption & {
    type: ApplicationCommandOptionTypes.SUB_COMMAND_GROUP;
};
