exports.up = function (knex) {
  return knex.schema.createTable('strategies', (table) => {
    table.increments('id');
    table.string('name').notNullable();
    table.string('access_id').notNullable().unique();
    table.string('permission').notNullable();
    table.string('password').notNullable();
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('strategies');
};
