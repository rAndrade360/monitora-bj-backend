exports.up = function (knex) {
  return knex.schema.createTable('districts', function (table) {
    table.increments('id');
    table.string('name').notNullable();
    table.string('zone');
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('districts');
};
