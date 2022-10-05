import { RuleType } from '../../../../models/Role';
import { ApplicationCommandOption, ApplicationCommandOptionTypes } from '../../types';

export const roleConditionTypeSelector: ApplicationCommandOption = {
    name: 'condition',
    description: 'What sort of condition should be rquired to give out this role',
    required: true,
    type: ApplicationCommandOptionTypes.STRING,
    choices: [
        {
            name: 'Noone; role will be removed from everyone who has it',
            value: RuleType.noone,
        },
        {
            name: 'Everyone; everyone will be given this role, unless another role in role-group has higher priority',
            value: RuleType.everyone,
        },
        {
            name: 'FFlogs; additional menus will show up for your configuration',
            value: RuleType.fflogs,
        },
    ],
};
