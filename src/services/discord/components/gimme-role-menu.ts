import { InteractionResponseType } from 'discord-interactions';
import { Request, Response } from 'express';
import { SelectOption, MenuComponent, createMenuComponent, createActionRowComponent } from '.';
import { Guild } from '../../../models/Guild';
import { GuildMember } from '../types';
import { performRoleUpdate } from '../../core/perform-role-update';
import performFollowup from '../performFollowup';
import { respondWithInteractiveComponent } from '../respondToInteraction';
import { RefreshButtonTypes, makeRefreshButton } from './refresh-button';
import { updateGimmeRolesCache } from '../commands/gimme-roles';

export function makeGimmeRoleMenu(options: SelectOption[]): MenuComponent {
    return createMenuComponent({
        custom_id: 'GimmeRole-selectGroupDropdown',
        placeholder: 'Select group',
        options,
    });
}

export async function handleGimmeRoleSelection(req: Request, res: Response) {
    const guild: Guild = res.locals.guild;
    const { data, member } = req.body;

    const groupsSelected = data.values; // only 1 value here tho

    let members: GuildMember[] = [member];

    performRoleUpdate(guild, members, groupsSelected, updateGimmeRolesCache(member.user.id));

    res.send(
        respondWithInteractiveComponent(
            `Updating roles roles for <@${member.user.id}>`,
            [createActionRowComponent([makeRefreshButton(RefreshButtonTypes.refreshGimmeRoles)])],
            {
                interactionResponseType: InteractionResponseType.UPDATE_MESSAGE,
            }
        )
    );
}
