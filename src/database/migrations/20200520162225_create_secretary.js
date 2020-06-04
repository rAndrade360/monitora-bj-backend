
exports.up = function (knex) {
    return knex.schema.createTable('secretaries', function (table) {
        table.increments('id');
        table.string('acess_id');
        table.string('password');
    })
};

exports.down = function (knex) {
    return knex.schema.dropTable('secretaries')
};
