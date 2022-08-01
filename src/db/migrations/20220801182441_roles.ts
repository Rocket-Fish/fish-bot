import { Knex } from 'knex';

const tableName = 'roles';

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable(tableName, (table) => {
        table.increments('id').primary();
        table.integer('guild_id').unsigned().index().references('id').inTable('guilds');
        table.string('d_role_id').notNullable();
        table.json('rule').notNullable();
        table.timestamps(true, true);
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable(tableName);
}
