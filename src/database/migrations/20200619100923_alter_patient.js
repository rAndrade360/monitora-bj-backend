exports.up = function (knex) {
  return knex.schema.alterTable('patients', function (table) {
    table.string('monther_name').nullable().alter();
    table.string('cpf').nullable().alter();
    table.string('phone_number').nullable().alter();
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('patients', function (table) {
    table.string('monther_name').notNullable().alter();
    table.string('cpf').notNullable().alter();
    table.string('phone_number').notNullable().alter();
  });
};
