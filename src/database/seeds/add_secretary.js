const generateHash = require('../../app/utils/generateHashedPassword');
require('dotenv').config();
const bcrypt = require('bcrypt');
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex(process.env.SECRETARY_DEFAULT_TABLE).del()
    .then(function () {
      // Inserts seed entries
      return knex(process.env.SECRETARY_DEFAULT_TABLE).insert([
        {
          acess_id: process.env.SECRETARY_DEFAULT_ID,
          password: generateHash(process.env.SECRETARY_DEFAULT_PASSWORD, bcrypt)
        },
      ]);
    });
};
