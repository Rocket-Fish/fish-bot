import { InteractionResponseType } from 'discord-interactions';
import { Request, Response } from 'express';
import { SelectOption, MenuComponent, createMenuComponent, createActionRowComponent } from '.';
import { respondWithInteractiveComponent } from '../respondToInteraction';
import { Guild } from '../../../models/Guild';
import { sleep } from '../../../utils/sleep';
import { performRoleUpdate } from '../../core/perform-role-update';
import { getGuildMembers } from '../guilds';
import { GuildMember } from '../types';
import { makeRefreshButton } from './refresh-button';
import performFollowup from '../performFollowup';

export function makeForEachMemberInServerUpdateRolesMenu(options: SelectOption[]): MenuComponent {
    return createMenuComponent({
        custom_id: '4EachMemberIn-selectGroupDropdown',
        placeholder: 'Select groups',
        options,
        min_values: 1,
        max_values: options.length,
    });
}

export async function handleForEachMemberInServerUpdateRolesSelection(req: Request, res: Response) {
    const guild: Guild = res.locals.guild;
    const { data, token: interactionToken } = req.body;

    const groupsSelected = data.values;

    let members: GuildMember[] = [];
    let lastMember: GuildMember | undefined = undefined;
    while (true) {
        const fetchedMembers: GuildMember[] = await getGuildMembers(guild.discord_guild_id, lastMember?.user?.id);
        if (fetchedMembers.length === 0) {
            break;
        }
        members = members.concat(fetchedMembers);
        lastMember = fetchedMembers[fetchedMembers.length - 1];
        await sleep(500);
    }

    performRoleUpdate(guild, members, groupsSelected);

    performFollowup(
        interactionToken,
        respondWithInteractiveComponent('Updating roles for all members', [createActionRowComponent([makeRefreshButton()])], {
            ephemeral: false,
            interactionResponseType: InteractionResponseType.UPDATE_MESSAGE,
        }).data
    );
    res.send({
        type: InteractionResponseType.UPDATE_MESSAGE,
        data: {
            content: 'Initialization complete, each member will be updated according to the roles in the groups selected',
            components: [],
        },
    });
}
