exports.up = function (knex) {
  return knex.schema.createTable('fixed_reports', function (table) {
    table.increments('id').primary();
    table
      .integer('patient_id')
      .unsigned()
      .notNullable()
      .unique()
      .references('id')
      .inTable('patients')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
    table
      .integer('symptoms_id')
      .unsigned()
      .notNullable()
      .unique()
      .references('id')
      .inTable('daily_reports')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
    table.boolean('recent_travel').notNullable().defaultTo(false);
    table.string('traveled_to_city');
    table.boolean('recent_contact').notNullable().defaultTo(false);
    table.string('status').notNullable();
    table.string('risk').notNullable();
    table.date('screening_day').notNullable();
    table.date('symptom_onset_date').notNullable();
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('fixed_reports');
};
