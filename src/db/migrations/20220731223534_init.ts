import { Knex } from 'knex';

const guildTableName = 'guilds';
const roleTableName = 'roles';
const roleGroupTableName = 'role_groups';
const roleGroupOrderTableName = 'role_groups_order';

export async function up(knex: Knex): Promise<void> {
    return knex.schema
        .createTable(guildTableName, (table) => {
            table.uuid('id').primary().unique().defaultTo(knex.raw('gen_random_uuid()'));
            table.string('discord_guild_id').notNullable().unique();
            table.timestamps(true, true);
        })
        .createTable(roleGroupTableName, (table) => {
            table.uuid('id').primary().unique().defaultTo(knex.raw('gen_random_uuid()'));
            table.timestamps(true, true);
        })
        .createTable(roleTableName, (table) => {
            table.uuid('id').primary().unique().defaultTo(knex.raw('gen_random_uuid()'));
            table.uuid('guild_id').index().references('id').inTable(guildTableName).notNullable();
            table.string('discord_role_id').notNullable();
            table.json('rule').notNullable();
            table.timestamps(true, true);
        })
        .createTable(roleGroupOrderTableName, (table) => {
            table.uuid('id').primary().unique().defaultTo(knex.raw('gen_random_uuid()'));
            table.uuid('role_group_id').index().references('id').inTable(roleGroupTableName).notNullable();
            table.uuid('role_id').index().references('id').inTable(roleTableName).nullable();
            table.integer('priority').notNullable();
            table.timestamps(true, true);
        });
}

export async function down(knex: Knex): Promise<void> {
    // reverse order of above to prevent error
    return knex.schema.dropTable(roleGroupOrderTableName).dropTable(roleTableName).dropTable(roleGroupTableName).dropTable(guildTableName);
}
