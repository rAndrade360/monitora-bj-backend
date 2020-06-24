exports.up = function (knex) {
  return knex.schema.createTable('test_data', function (table) {
    table.increments('id').primary();
    table
      .integer('patient_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('patients')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
    table.string('test_status').notNullable().defaultTo('solicitado');
    table.string('test_type').notNullable().defaultTo('teste_rapido_anticorpo');
    table.boolean('test_result');
    table.string('final_classification');
    table.date('collection_date');
    table.date('closing_date');
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('test_data');
};
