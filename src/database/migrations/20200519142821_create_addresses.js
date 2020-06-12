
exports.up = function (knex) {
    return knex.schema.createTable('addresses', function (table) {
        table.increments('id').primary();
        table.integer('patient_id')
            .unsigned()
            .notNullable()
            .references('id')
            .inTable('patients')
            .onDelete('CASCADE')
            .onUpdate('CASCADE');
        table.string('cep').notNullable();
        table.string('address').notNullable();
        table.string('street').notNullable();
        table.integer('number').notNullable();
        table.string('complement');
        table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
        table.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());
    })
};

exports.down = function (knex) {
    return knex.schema.dropTable('addresses');
};
