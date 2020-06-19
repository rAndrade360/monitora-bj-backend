exports.up = function (knex) {
  return knex.schema.table('addresses', function (table) {
    table.string('address').nullable().alter();
    table.string('street').nullable().alter();
    table.string('number').nullable().alter();
  });
};

exports.down = function (knex) {
  return knex.schema.table('addresses', function (table) {
    table.string('address').notNullable();
    table.string('street').notNullable();
    table.integer('number').notNullable();
  });
};
