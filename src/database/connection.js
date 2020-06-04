const knexConfig = require('../../knexfile')[process.env.NODE_ENV];
const knex = require('knex');
const connection = knex(knexConfig);
module.exports = connection;