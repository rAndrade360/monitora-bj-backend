
exports.up = function (knex) {
  return knex.schema.createTable('patient_conditions', function (table) {
      table.increments('id').primary();
      table.integer('patient_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('patients')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
      table.integer('condition_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('conditions')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
      table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
      table.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());
  })
};

exports.down = function (knex) {
  return knex.schema.dropTable('patient_conditions');
};
