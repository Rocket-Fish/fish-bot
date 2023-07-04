import { InteractionResponseType } from 'discord-interactions';
import { Request, Response } from 'express';
import { CachedInteractiveComponent, MenuComponent, createActionRowComponent, createMenuComponent } from '.';
import { Guild } from '../../../models/Guild';
import { createRole, FFlogsDifficulty, Rule, RuleCondition, RuleOperand, RuleType } from '../../../models/Role';
import { respondWithAcknowledgement, respondWithInteractiveComponent } from '../respondToInteraction';

export const CREATE_FFLOGS_ROLE = 'createFFlogsRole';

export const createFflogsRole = new CachedInteractiveComponent<CreateFFlogsRolePropertiesToData>(
    CREATE_FFLOGS_ROLE,
    generateInteraction,
    handleCreateFFlogsRole
);

function generateInteraction() {
    return respondWithInteractiveComponent('Select fflogs zone, operand and condition', [
        createActionRowComponent([makeZoneMenu()]),
        createActionRowComponent([makeOperandMenu()]),
        createActionRowComponent([makeConditionMenu()]),
    ]);
}

function makeZoneMenu(): MenuComponent {
    return createMenuComponent({
        custom_id: CreateFFlogsRoleProperties.selectZone,
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

function makeOperandMenu(): MenuComponent {
    return createMenuComponent({
        custom_id: CreateFFlogsRoleProperties.selectOperand,
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

function makeConditionMenu(): MenuComponent {
    return createMenuComponent({
        custom_id: CreateFFlogsRoleProperties.selectCondition,
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
export enum CreateFFlogsRoleProperties {
    roleId = 'role_id',
    selectZone = 'select_zone',
    selectOperand = 'select_operand',
    selectCondition = 'select_condition',
}

export type CreateFFlogsRolePropertiesToData = {
    [k in CreateFFlogsRoleProperties]: string;
};

function isInformationGatheringComplete(value: CreateFFlogsRolePropertiesToData) {
    return (
        value[CreateFFlogsRoleProperties.selectCondition] &&
        value[CreateFFlogsRoleProperties.selectOperand] &&
        value[CreateFFlogsRoleProperties.selectZone]
    );
}

async function handleCreateFFlogsRole(
    t: CachedInteractiveComponent<CreateFFlogsRolePropertiesToData>,
    req: Request,
    res: Response,
    cache: CreateFFlogsRolePropertiesToData
) {
    const guild: Guild = res.locals.guild;

    if (isInformationGatheringComplete(cache)) {
        const splitZone = cache.select_zone.split(',');
        const rule: Rule = {
            type: RuleType.fflogs,
            area: {
                type: 'zone',
                id: Number(splitZone[0]),
                difficulty: Number(splitZone[1]),
            },
            operand: cache.select_operand as RuleOperand,
            condition: cache.select_condition as RuleCondition,
        };

        await createRole(guild.id, cache.role_id, rule);
        return res.send({
            type: InteractionResponseType.UPDATE_MESSAGE,
            data: {
                content: `Role <@&${cache.role_id}> will be given to users who has ${cache.select_operand} ${cache.select_condition} in Zone ${splitZone[0]} at Difficulty ${splitZone[1]}`,
                components: [],
            },
        });
    } else {
        return res.send(respondWithAcknowledgement());
    }
}
