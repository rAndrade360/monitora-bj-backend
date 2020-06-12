
exports.up = function (knex) {
    return knex.schema.createTable('patients', function (table) {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.string('monther_name').notNullable();
        table.boolean('has_cpf').defaultTo(true);
        table.boolean('is_foreign').defaultTo(false);
        table.boolean('healthcare_professional').defaultTo(false);
        table.string('cpf').notNullable().unique();
        table.string('cbo');
        table.string('cns');
        table.string('phone_number').notNullable();
        table.string('whatsapp');
        table.string('genre').notNullable();
        table.date('birthday').notNullable();
        table.string('passport');
        table.string('origin_country').defaultTo('Brasil');
        table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
        table.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());
    })
};

exports.down = function (knex) {
    return knex.schema.dropTable('patients');
};
