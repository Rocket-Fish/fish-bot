import { Knex } from 'knex';

const tableName = 'roles';

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable(tableName, (table) => {
        table.uuid('id').primary().unique().defaultTo(knex.raw('gen_random_uuid()'));
        table.uuid('guild_id').index().references('id').inTable('guilds');
        table.string('discord_role_id').notNullable();
        table.json('rule').notNullable();
        table.timestamps(true, true);
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable(tableName);
}
