
exports.up = function (knex) {
    return knex.schema.createTable('patients', function (table) {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.string('cpf').notNullable().unique();
        table.string('phone_number').notNullable();
        table.string('genre').notNullable();
        table.date('birthday').notNullable();
        table.date('screening_day').notNullable();
        table.string('status').notNullable();
        table.string('risk').notNullable();
        table.string('password').notNullable();
        table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
        table.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());
    })
};

exports.down = function (knex) {
    return knex.schema.dropTable('patients')
};
