import { Knex } from 'knex';

const guildTableName = 'guilds';
const roleTableName = 'roles';
const groupTableName = 'groups';
const roleGroupWithPriorityTableName = 'role_group_with_priority';

const CASCADE = 'CASCADE';

export async function up(knex: Knex): Promise<void> {
    return knex.schema
        .createTable(guildTableName, (table) => {
            table.uuid('id').primary().unique().defaultTo(knex.raw('gen_random_uuid()'));
            table.string('discord_guild_id').notNullable().unique();
            table.timestamps(true, true);
        })
        .createTable(groupTableName, (table) => {
            table.uuid('id').primary().unique().defaultTo(knex.raw('gen_random_uuid()'));
            table.uuid('guild_id').index().references('id').inTable(guildTableName).notNullable().onDelete(CASCADE);
            table.string('name');
            table.timestamps(true, true);
        })
        .createTable(roleTableName, (table) => {
            table.uuid('id').primary().unique().defaultTo(knex.raw('gen_random_uuid()'));
            table.uuid('guild_id').index().references('id').inTable(guildTableName).notNullable().onDelete(CASCADE);
            table.string('discord_role_id').notNullable();
            table.json('rule').notNullable();
            table.timestamps(true, true);
        })
        .createTable(roleGroupWithPriorityTableName, (table) => {
            table.uuid('id').primary().unique().defaultTo(knex.raw('gen_random_uuid()'));
            table.uuid('group_id').index().references('id').inTable(groupTableName).notNullable().onDelete(CASCADE);
            table.uuid('role_id').index().references('id').inTable(roleTableName).notNullable().onDelete(CASCADE);
            table.integer('priority').notNullable();
            table.timestamps(true, true);
        });
}

export async function down(knex: Knex): Promise<void> {
    // reverse order of above to prevent error
    return knex.schema.dropTable(roleGroupWithPriorityTableName).dropTable(roleTableName).dropTable(groupTableName).dropTable(guildTableName);
}
