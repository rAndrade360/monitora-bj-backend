exports.up = function (knex) {
  return knex.schema.table('addresses', function (table) {
    table.dropColumn('address');
    table
      .integer('district_id')
      .unsigned()
      .references('id')
      .inTable('districts')
      .onDelete('SET NULL')
      .onUpdate('CASCADE');
  });
};

exports.down = function (knex) {
  return knex.schema.table('addresses', function (table) {
    table.dropColumn('district_id');
    table.string('address').nullable();
  });
};
