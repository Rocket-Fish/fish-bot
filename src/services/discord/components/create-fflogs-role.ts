import { InteractionResponseType } from 'discord-interactions';
import { Request, Response } from 'express';
import { MenuComponent, createMenuComponent } from '.';
import { Guild } from '../../../models/Guild';
import { createRole, FFlogsDifficulty, Rule, RuleCondition, RuleOperand, RuleType } from '../../../models/Role';
import redisClient from '../../redis-client';
import { respondWithAcknowledgement } from '../respondToInteraction';

export function makeZoneMenu(): MenuComponent {
    return createMenuComponent({
        custom_id: 'select_zone',
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

export function makeOperandMenu(): MenuComponent {
    return createMenuComponent({
        custom_id: 'select_operand',
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

export function makeConditionMenu(): MenuComponent {
    return createMenuComponent({
        custom_id: 'select_condition',
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
export enum CreateFFlogsRoleIds {
    roleId = 'role_id',
    selectZone = 'select_zone',
    selectOperand = 'select_operand',
    selectCondition = 'select_condition',
}

export function createFflogsRoleKey(interactionId: string) {
    return `create-fflogs-role:${interactionId}`;
}

export type CreateFflogsRoleData = {
    [k in CreateFFlogsRoleIds]: string;
};

export async function cacheCreateFflogsRoleSelection(interactionId: string, value: CreateFflogsRoleData) {
    return await redisClient.setEx(createFflogsRoleKey(interactionId), 60 * 30, JSON.stringify(value));
}

async function getCachedFFlogsRoleSelection(interactionId: string) {
    return await redisClient.get(createFflogsRoleKey(interactionId));
}

function isInformationGatheringComplete(value: CreateFflogsRoleData) {
    return value[CreateFFlogsRoleIds.selectCondition] && value[CreateFFlogsRoleIds.selectOperand] && value[CreateFFlogsRoleIds.selectZone];
}

export async function handleCreateFFlogsRole(req: Request, res: Response) {
    const { body } = req;
    const { data } = body;
    const interactionId: string = body.message.interaction.id;
    const guild: Guild = res.locals.guild;

    // TODO: refactor this function has similar contents to handleAddRoleToGroup()
    const cachedValue: string | null = await getCachedFFlogsRoleSelection(interactionId);
    if (!cachedValue) {
        return res.send({
            type: InteractionResponseType.UPDATE_MESSAGE,
            data: {
                content: 'This component has timed out, please run the command again',
                components: [],
            },
        });
    }

    const cachedObject: CreateFflogsRoleData = JSON.parse(cachedValue);
    const key: CreateFFlogsRoleIds = data.custom_id;

    const selection = {
        ...cachedObject,
        [key]: data.values[0],
    };

    await cacheCreateFflogsRoleSelection(interactionId, selection);

    if (isInformationGatheringComplete(selection)) {
        const splitZone = selection.select_zone.split(',');
        const rule: Rule = {
            type: RuleType.fflogs,
            area: {
                type: 'zone',
                id: Number(splitZone[0]),
                difficulty: Number(splitZone[1]),
            },
            operand: selection.select_operand as RuleOperand,
            condition: selection.select_condition as RuleCondition,
        };

        await createRole(guild.id, selection.role_id, rule);
        return res.send({
            type: InteractionResponseType.UPDATE_MESSAGE,
            data: {
                content: `Role <@&${selection.role_id}> will be given to users who has ${selection.select_operand} ${selection.select_condition} in Zone ${splitZone[0]} at Difficulty ${splitZone[1]}`,
                components: [],
            },
        });
    } else {
        return res.send(respondWithAcknowledgement());
    }
}
