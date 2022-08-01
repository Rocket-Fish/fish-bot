import { Knex } from 'knex';

const tableName = 'guilds';

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable(tableName, (table) => {
        table.increments('id').primary();
        table.string('d_guild_id').notNullable().unique();
        table.timestamps(true, true);
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable(tableName);
}
