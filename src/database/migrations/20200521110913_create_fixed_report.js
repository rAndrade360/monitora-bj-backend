
exports.up = function (knex) {
    return knex.schema.createTable('fixed_reports', function (table) {
        table.increments('id').primary();
        table.integer('patient_id')
            .unsigned()
            .notNullable()
            .unique()
            .references('patients.id')
            .onDelete('CASCADE')
            .onUpdate('CASCADE');
        table.boolean('recent_travel').notNullable().defaultTo(false);
        table.string('traveled_to_city');
        table.boolean('recent_contact').notNullable().defaultTo(false);
        table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
        table.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());
    })
};

exports.down = function (knex) {
    return knex.schema.dropTable('fixed_reports')
};
