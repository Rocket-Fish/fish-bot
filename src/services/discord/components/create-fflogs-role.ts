import { InteractionResponseType } from 'discord-interactions';
import { Request, Response } from 'express';
import { MenuComponent, createMenuComponent } from '.';
import { Guild } from '../../../models/Guild';
import { createRole, Rule, RuleType } from '../../../models/Role';
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
                label: 'Abyssos Savage',
                value: '49-savage',
                description: 'p5s-p8s',
            },
            // {
            //     label: 'Asphodelos Savage',
            //     value: '44-savage',
            //     description: 'p1s - p4s',
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
                value: 'number_pink_count',
                description: 'Number of pink encounters in zone',
            },
            {
                label: 'Number of orange parses',
                value: 'number_orange_count',
                description: 'Number of orange encounters in zone',
            },
            {
                label: 'Number of purple parses',
                value: 'number_purple_count',
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
                label: 'Greater than 4',
                value: 'greater_than_4',
                description: 'Operand must be greater than four',
            },
        ],
    });
}
export enum CreateFFlogsRoleMenuIds {
    roleId = 'rold_id',
    selectZone = 'select_zone',
    selectOperand = 'select_operand',
    selectCondition = 'select_condition',
}

export function createFflogsRoleKey(interactionId: string) {
    return `createFFlogsRole-${interactionId}`;
}

export type CreateFflogsRoleData = {
    [k in CreateFFlogsRoleMenuIds]: string;
};

export async function cacheCreateFflogsRoleSelection(interactionId: string, value: CreateFflogsRoleData) {
    return await redisClient.setEx(createFflogsRoleKey(interactionId), 60 * 30, JSON.stringify(value));
}

async function getCachedFFlogsRoleSelection(interactionId: string) {
    return await redisClient.get(createFflogsRoleKey(interactionId));
}

function isInformationGatheringComplete(value: CreateFflogsRoleData) {
    return (
        value[CreateFFlogsRoleMenuIds.selectCondition] && value[CreateFFlogsRoleMenuIds.selectOperand] && value[CreateFFlogsRoleMenuIds.selectZone]
    );
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
    const key: CreateFFlogsRoleMenuIds = data.custom_id;

    const selection = {
        ...cachedObject,
        [key]: data.values[0],
    };

    await cacheCreateFflogsRoleSelection(interactionId, selection);

    if (isInformationGatheringComplete(selection)) {
        const rule: Rule = { type: RuleType.fflogs };

        await createRole(guild.id, selection.rold_id, rule);
        return res.send({
            type: InteractionResponseType.UPDATE_MESSAGE,
            data: {
                content: `Role Rule Created: Role <@&${selection.rold_id}> will be removed from anyone who has it`,
                components: [],
            },
        });
    } else {
        return res.send(respondWithAcknowledgement());
    }
}
