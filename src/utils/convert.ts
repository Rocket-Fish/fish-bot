import { FFlogsAreaType, Role, Rule, RuleType } from '../models/Role';
import { Group } from '../models/Group';
import { SelectOption } from '../services/discord/components';

export function convertRoleConfigToSentance(rule: Rule) {
    switch (rule.type) {
        case RuleType.everyone:
            return `Role will be given to everyone`;
        case RuleType.noone:
            return `Role should be remove-only`;
        case RuleType.fflogs:
            if (rule.area.type === FFlogsAreaType.zone)
                return `Requirement: ${rule.operand} ${rule.condition} in Zone ${rule.area.id} at Difficulty ${rule.area.difficulty}`;
            else return `Requirement: ${rule.operand} ${rule.condition} in Encounter ${rule.area.id}`;
        default:
            return 'Error converting role config to description';
    }
}

export function convertRoleListToSelectOptions(roleList: Role[], guildRoleList: any[]): SelectOption[] {
    const menuOptionsList: SelectOption[] = roleList.map((r) => ({
        label: `@${guildRoleList.find((rr: any) => rr.id === r.discord_role_id)?.name || r.discord_role_id}`,
        value: r.id,
        description: convertRoleConfigToSentance(r.rule).substring(0, 100), // max 100 characters
    }));

    return menuOptionsList;
}

export function convertGroupListToSelectOptions(groupList: Group[]): SelectOption[] {
    const groupOptions: SelectOption[] = groupList.map((rg) => ({
        label: rg.name,
        value: rg.id,
    }));
    return groupOptions;
}
