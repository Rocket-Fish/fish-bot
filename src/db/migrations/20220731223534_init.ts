import { Knex } from 'knex';

const tableName = 'guilds';

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable(tableName, (table) => {
        table.uuid('id').primary().unique().defaultTo(knex.raw('gen_random_uuid()'));
        table.string('discord_guild_id').notNullable().unique();
        table.timestamps(true, true);
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable(tableName);
}
