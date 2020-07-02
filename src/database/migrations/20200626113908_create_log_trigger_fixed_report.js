const { patient_logs } = require('../triggers/index');

exports.up = async (knex) => knex.raw(patient_logs('fixed_reports'));

exports.down = async (knex) =>
  knex.raw('DROP TRIGGER trg_tabela_log ON fixed_reports;');
