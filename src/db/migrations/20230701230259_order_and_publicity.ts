import { Knex } from 'knex';

const groupTableName = 'groups';

export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable(groupTableName, (table) => {
        table.boolean('is_ordered').notNullable().defaultTo(true);
        table.boolean('is_public').notNullable().defaultTo(false);
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.table(groupTableName, (table) => {
        table.dropColumn('is_public');
        table.dropColumn('is_ordered');
    });
}
