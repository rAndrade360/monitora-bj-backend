const knex = require('knex');
const knexHooks = require('knex-hooks');
const knexConfig = require('../../knexfile')[process.env.NODE_ENV];

const connection = knex(knexConfig);
knexHooks(connection);
module.exports = connection;
