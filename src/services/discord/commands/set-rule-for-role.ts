import { Request, Response } from 'express';
import { respondWithInteractiveComponent } from '../respondToInteraction';
import { ApplicationCommand, ApplicationCommandTypes } from '../types';

export const SET_RULE_FOR_ROLE: ApplicationCommand = {
    name: 'set-rule-for-role',
    description: 'Set a rule for obtaining a role when that rule is fulfilled',
    type: ApplicationCommandTypes.CHAT_INPUT,
    default_member_permissions: '0', // default to disable for everyone except server admins
};

export async function handleSetRuleForRole(req: Request, res: Response) {
    // TODO:
    return res.send(
        // TODO: replace with actual data
        respondWithInteractiveComponent([
            {
                type: 1,
                components: [
                    {
                        type: 3,
                        custom_id: 'class_select_1',
                        options: [
                            {
                                label: 'Rogue',
                                value: 'rogue',
                                description: 'Sneak n stab',
                                emoji: {
                                    name: 'rogue',
                                    id: '625891304148303894',
                                },
                            },
                            {
                                label: 'Mage',
                                value: 'mage',
                                description: "Turn 'em into a sheep",
                                emoji: {
                                    name: 'mage',
                                    id: '625891304081063986',
                                },
                            },
                            {
                                label: 'Priest',
                                value: 'priest',
                                description: "You get heals when I'm done doing damage",
                                emoji: {
                                    name: 'priest',
                                    id: '625891303795982337',
                                },
                            },
                        ],
                        placeholder: 'Choose a class',
                        min_values: 1,
                        max_values: 3,
                    },
                ],
            },
        ])
    );
}
