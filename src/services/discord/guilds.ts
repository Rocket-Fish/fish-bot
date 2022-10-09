import requestToDiscord from './requestToDiscordAPI';
import { GuildMember } from './types';

export async function getGuildRoles(guildId: string): Promise<any> {
    const res = await requestToDiscord(`guilds/${guildId}/roles`);
    return res.data;
}

export async function getGuildMembers(guildId: string, lastMemberId?: string): Promise<GuildMember[]> {
    const res = await requestToDiscord(`guilds/${guildId}/members`, { params: { limit: 1000, after: lastMemberId } });
    return res.data;
}

export async function giveGuildMemberRole(guildId: string, memberId: string, roleId: string) {
    return requestToDiscord(`guilds/${guildId}/members/${memberId}/roles/${roleId}`, {
        method: 'PUT',
    });
}

export async function removeRoleFromGuildMember(guildId: string, memberId: string, roleId: string) {
    return requestToDiscord(`guilds/${guildId}/members/${memberId}/roles/${roleId}`, {
        method: 'DELETE',
    });
}
