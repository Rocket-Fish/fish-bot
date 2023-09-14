import { InteractionResponseType } from 'discord-interactions';
import { Request, Response } from 'express';
import { CachedInteractiveComponent, MenuComponent, createActionRowComponent, createMenuComponent } from '.';
import { Guild } from '../../../models/Guild';
import { createRole, FFlogsAreaType, FFlogsDifficulty, Rule, RuleCondition, RuleOperand, RuleType } from '../../../models/Role';
import { InteractionResponse, respondWithAcknowledgement, respondWithInteractiveComponent } from '../respondToInteraction';

export const CREATE_FFLOGS_ROLE_INIT = 'createFFlogsRoleInit';
export const CREATE_FFLOGS_ROLE4ZONE = 'createFFlogsRole4Zone';
export const CREATE_FFLOGS_ROLE4ENCOUNTER = 'createFFlogsRole4Encounter';

export const createFflogsRoleInit = new CachedInteractiveComponent<CreateFFlogsRoleInitPropertiesToData>(
    CREATE_FFLOGS_ROLE_INIT,
    createFFlogsRoleInitMenu,
    handleCreateFFlogsRoleInit
);

export enum CreateFFlogsRoleInitProperties {
    roleId = 'create-fflogs-role-init:role_id',
    type = 'create-fflogs-role-init:type',
}

export type CreateFFlogsRoleInitPropertiesToData = {
    [k in CreateFFlogsRoleInitProperties]: string;
};

function createFFlogsRoleInitMenu(): InteractionResponse {
    return respondWithInteractiveComponent('What type of fflogs rules to apply to this role', [
        createActionRowComponent([
            createMenuComponent({
                custom_id: CreateFFlogsRoleInitProperties.type,
                placeholder: 'Encounter or Zone',
                options: [
                    {
                        label: 'Encounter',
                        value: FFlogsAreaType.encounter,
                    },
                    {
                        label: 'Zone',
                        value: FFlogsAreaType.zone,
                    },
                ],
            }),
        ]),
    ]);
}

async function handleCreateFFlogsRoleInit(
    t: CachedInteractiveComponent<CreateFFlogsRoleInitPropertiesToData>,
    req: Request,
    res: Response,
    cache: CreateFFlogsRoleInitPropertiesToData,
    prevCache: CreateFFlogsRoleInitPropertiesToData
) {
    const { message } = req.body;
    const type = cache[CreateFFlogsRoleInitProperties.type];
    const roleId = cache[CreateFFlogsRoleInitProperties.roleId];

    if (type === FFlogsAreaType.zone) {
        const response = await createFflogsRole4Zone.initInteraction(message.interaction.id, {
            [CreateFFlogsRole4ZoneProperties.roleId]: roleId,
            [CreateFFlogsRole4ZoneProperties.selectCondition]: '',
            [CreateFFlogsRole4ZoneProperties.selectOperand]: '',
            [CreateFFlogsRole4ZoneProperties.selectZone]: '',
        });
        return res.send(response);
    } else {
        const response = await createFFlogsRole4Encounter.initInteraction(message.interaction.id, {
            [CreateFFlogsRole4EncounterProperties.roleId]: roleId,
            [CreateFFlogsRole4EncounterProperties.selectCondition]: '',
            [CreateFFlogsRole4EncounterProperties.selectOperand]: '',
            [CreateFFlogsRole4EncounterProperties.selectEncounter]: '',
        });
        return res.send(response);
    }
}

export const createFflogsRole4Zone = new CachedInteractiveComponent<CreateFFlogsRole4ZonePropertiesToData>(
    CREATE_FFLOGS_ROLE4ZONE,
    generateInteraction4Zone,
    handleCreateFFlogsRole4Zone
);

function generateInteraction4Zone() {
    return respondWithInteractiveComponent(
        'Select fflogs zone, operand and condition',
        [
            createActionRowComponent([makeZoneMenu()]),
            createActionRowComponent([makeZoneOperandMenu()]),
            createActionRowComponent([makeZoneConditionMenu()]),
        ],
        {
            interactionResponseType: InteractionResponseType.UPDATE_MESSAGE,
        }
    );
}

function makeZoneMenu(): MenuComponent {
    return createMenuComponent({
        custom_id: CreateFFlogsRole4ZoneProperties.selectZone,
        placeholder: 'In What Zone?',
        max_values: 1,
        min_values: 1,
        options: [
            {
                label: 'Anabaseios Savage',
                value: `54,${FFlogsDifficulty.savage}`,
            },
            {
                label: 'Abyssos Savage',
                value: `49,${FFlogsDifficulty.savage}`,
            },
            // {
            //     label: 'Asphodelos Savage',
            //     value: '44-savage'
            // },
            // TODO: make this dynamically fetched from fflogs
        ],
    });
}

function makeZoneOperandMenu(): MenuComponent {
    return createMenuComponent({
        custom_id: CreateFFlogsRole4ZoneProperties.selectOperand,
        placeholder: 'What operand should be compared',
        options: [
            {
                label: 'Number of pink parses',
                value: RuleOperand.numberPinkParses,
                description: 'Number of pink encounters in zone',
            },
            {
                label: 'Number of orange parses',
                value: RuleOperand.numberOrangeParses,
                description: 'Number of orange encounters in zone',
            },
            {
                label: 'Number of purple parses',
                value: RuleOperand.numberPurpleParses,
                description: 'Number of purple encounters in zone',
            },
        ],
    });
}

function makeZoneConditionMenu(): MenuComponent {
    return createMenuComponent({
        custom_id: CreateFFlogsRole4ZoneProperties.selectCondition,
        placeholder: 'Under what condition should the operand be subjected to?',
        options: [
            {
                label: '>= 4',
                value: RuleCondition.greaterThanOrEqualTo4,
                description: 'Operand must be greater than or equal to four',
            },
            {
                label: '>= 3',
                value: RuleCondition.greaterThanOrEqualTo3,
                description: 'Operand must be greater than or equal to three',
            },
        ],
    });
}
export enum CreateFFlogsRole4ZoneProperties {
    roleId = 'CreateFFlogsRole4Zone:role_id',
    selectZone = 'CreateFFlogsRole4Zone:select_zone',
    selectOperand = 'CreateFFlogsRole4Zone:select_operand',
    selectCondition = 'CreateFFlogsRole4Zone:select_condition',
}

export type CreateFFlogsRole4ZonePropertiesToData = {
    [k in CreateFFlogsRole4ZoneProperties]: string;
};

function isAllZoneRulesInfoCompleted(value: CreateFFlogsRole4ZonePropertiesToData) {
    return (
        value[CreateFFlogsRole4ZoneProperties.selectCondition] &&
        value[CreateFFlogsRole4ZoneProperties.selectOperand] &&
        value[CreateFFlogsRole4ZoneProperties.selectZone]
    );
}

async function handleCreateFFlogsRole4Zone(
    t: CachedInteractiveComponent<CreateFFlogsRole4ZonePropertiesToData>,
    req: Request,
    res: Response,
    cache: CreateFFlogsRole4ZonePropertiesToData
) {
    const guild: Guild = res.locals.guild;

    if (isAllZoneRulesInfoCompleted(cache)) {
        const splitZone = cache[CreateFFlogsRole4ZoneProperties.selectZone].split(',');
        const rule: Rule = {
            type: RuleType.fflogs,
            area: {
                type: FFlogsAreaType.zone,
                id: Number(splitZone[0]),
                difficulty: Number(splitZone[1]),
            },
            operand: cache[CreateFFlogsRole4ZoneProperties.selectOperand] as RuleOperand,
            condition: cache[CreateFFlogsRole4ZoneProperties.selectCondition] as RuleCondition,
        };

        await createRole(guild.id, cache[CreateFFlogsRole4ZoneProperties.roleId], rule);
        return res.send({
            type: InteractionResponseType.UPDATE_MESSAGE,
            data: {
                content: `Role <@&${cache[CreateFFlogsRole4ZoneProperties.roleId]}> will be given to users who has ${
                    cache[CreateFFlogsRole4ZoneProperties.selectOperand]
                } ${cache[CreateFFlogsRole4ZoneProperties.selectCondition]} in Zone ${splitZone[0]} at Difficulty ${splitZone[1]}`,
                components: [],
            },
        });
    } else {
        return res.send(respondWithAcknowledgement());
    }
}

export const createFFlogsRole4Encounter = new CachedInteractiveComponent<CreateFFlogsRole4EncounterPropertiesToData>(
    CREATE_FFLOGS_ROLE4ENCOUNTER,
    generateInteraction4Encounter,
    handleCreateFFlogsRole4Encounter
);

function generateInteraction4Encounter() {
    return respondWithInteractiveComponent(
        'Select fflogs encounter, operand and condition',
        [
            createActionRowComponent([makeEncounterMenu()]),
            createActionRowComponent([makeEncounterOperandMenu()]),
            createActionRowComponent([makeEncounterConditionMenu()]),
        ],
        {
            interactionResponseType: InteractionResponseType.UPDATE_MESSAGE,
        }
    );
}

function makeEncounterMenu(): MenuComponent {
    return createMenuComponent({
        custom_id: CreateFFlogsRole4EncounterProperties.selectEncounter,
        placeholder: 'In What Encounter?',
        max_values: 1,
        min_values: 1,
        options: [
            {
                label: 'UCOB (Stormblood)',
                value: `19`,
            },
            {
                label: 'UCOB (Shadowbringers)',
                value: `1047`,
            },
            {
                label: 'UCOB (Endwalker)',
                value: `1060`,
            },
            {
                label: 'UwU (Stormblood)',
                value: `23`,
            },
            {
                label: 'UwU (Shadowbringers)',
                value: `1048`,
            },
            {
                label: 'UwU (Endwalker)',
                value: `1061`,
            },
            {
                label: 'TEA (Shadowbringers)',
                value: `1050`,
            },
            {
                label: 'TEA (Endwalker)',
                value: `1062`,
            },
            {
                label: 'DSR (Endwalker)',
                value: `1065`,
            },
            {
                label: 'TOP (Endwalker)',
                value: `1068`,
            },
            // TODO: make this dynamically fetched from fflogs
        ],
    });
}

function makeEncounterOperandMenu(): MenuComponent {
    return createMenuComponent({
        custom_id: CreateFFlogsRole4EncounterProperties.selectOperand,
        placeholder: 'What operand should be compared',
        options: [
            {
                label: 'Number of kills',
                value: RuleOperand.numberOfKills,
                description: 'Number of times a user has cleared this encounter',
            },
        ],
    });
}

function makeEncounterConditionMenu(): MenuComponent {
    return createMenuComponent({
        custom_id: CreateFFlogsRole4EncounterProperties.selectCondition,
        placeholder: 'Under what condition should the operand be subjected to?',
        options: [
            {
                label: '>= 1',
                value: RuleCondition.greaterThanOrEqualTo1,
                description: 'Operand must be greater than or equal to one',
            },
        ],
    });
}

export enum CreateFFlogsRole4EncounterProperties {
    roleId = 'CreateFFlogsRole4EncounterProperties:role_id',
    selectEncounter = 'CreateFFlogsRole4EncounterProperties:select_encounter',
    selectOperand = 'CreateFFlogsRole4EncounterProperties:select_operand',
    selectCondition = 'CreateFFlogsRole4EncounterProperties:select_condition',
}

export type CreateFFlogsRole4EncounterPropertiesToData = {
    [k in CreateFFlogsRole4EncounterProperties]: string;
};

function isAllEncounterRulesInfoCompleted(value: CreateFFlogsRole4EncounterPropertiesToData) {
    return (
        value[CreateFFlogsRole4EncounterProperties.selectCondition] &&
        value[CreateFFlogsRole4EncounterProperties.selectOperand] &&
        value[CreateFFlogsRole4EncounterProperties.selectEncounter]
    );
}

async function handleCreateFFlogsRole4Encounter(
    t: CachedInteractiveComponent<CreateFFlogsRole4EncounterPropertiesToData>,
    req: Request,
    res: Response,
    cache: CreateFFlogsRole4EncounterPropertiesToData
) {
    const guild: Guild = res.locals.guild;

    if (isAllEncounterRulesInfoCompleted(cache)) {
        const encounter = cache[CreateFFlogsRole4EncounterProperties.selectEncounter];
        const rule: Rule = {
            type: RuleType.fflogs,
            area: {
                type: FFlogsAreaType.encounter,
                id: Number(encounter),
            },
            operand: cache[CreateFFlogsRole4EncounterProperties.selectOperand] as RuleOperand,
            condition: cache[CreateFFlogsRole4EncounterProperties.selectCondition] as RuleCondition,
        };

        await createRole(guild.id, cache[CreateFFlogsRole4EncounterProperties.roleId], rule);
        return res.send({
            type: InteractionResponseType.UPDATE_MESSAGE,
            data: {
                content: `Role <@&${cache[CreateFFlogsRole4EncounterProperties.roleId]}> will be given to users who has ${
                    cache[CreateFFlogsRole4EncounterProperties.selectOperand]
                } ${cache[CreateFFlogsRole4EncounterProperties.selectCondition]} in Encounter ${encounter}`,
                components: [],
            },
        });
    } else {
        return res.send(respondWithAcknowledgement());
    }
}
