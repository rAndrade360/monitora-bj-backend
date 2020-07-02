exports.up = function (knex) {
  return knex.schema.createTable('patient_logs', (table) => {
    table.increments('id');
    table
      .integer('patient_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('patients')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
    table
      .integer('strategy_id')
      .unsigned()
      .references('id')
      .inTable('strategies')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
    table.string('field_name').notNullable();
    table.string('table_name').notNullable();
    table.string('old_value');
    table.string('new_value');
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('patient_logs');
};
