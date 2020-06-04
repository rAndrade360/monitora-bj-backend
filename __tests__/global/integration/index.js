const PatientModel = require('../../../src/app/models/Patient');
const connection = require('../../../src/database/connection');
module.exports = async () => {
  await PatientModel.deleteAll();
  await connection('secretaries').truncate();
}