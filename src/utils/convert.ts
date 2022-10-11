import { Role, RuleType } from '../models/Role';
import { RoleGroup } from '../models/RoleGroup';
import { SelectOption } from '../services/discord/components';

export function convertRoleConfigToSentance(role: Role) {
    const { rule } = role;
    switch (rule.type) {
        case RuleType.everyone:
            return `Role will be given to everyone`;
        case RuleType.noone:
            return `Role should be remove-only`;
        case RuleType.fflogs:
        // TODO: `Give role to users whos ...`
        default:
            return 'Error converting role config to description';
    }
}

export function convertRoleListToSelectOptions(roleList: Role[], guildRoleList: any[]): SelectOption[] {
    const menuOptionsList: SelectOption[] = roleList.map((r) => ({
        label: `@${guildRoleList.find((rr: any) => rr.id === r.discord_role_id)?.name || r.discord_role_id}`,
        value: r.id,
        description: convertRoleConfigToSentance(r),
    }));

    return menuOptionsList;
}

export function convertRoleGroupListToSelectOptions(roleGroupList: RoleGroup[]): SelectOption[] {
    const roleGroupOptions: SelectOption[] = roleGroupList.map((rg) => ({
        label: rg.name,
        value: rg.id,
    }));
    return roleGroupOptions;
}
