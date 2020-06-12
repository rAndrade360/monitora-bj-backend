const connection = require('../../database/connection');
const TestData = () => {
  const update = async (test_data, status) => {
    let testData;
    try {
      await connection.transaction(async trx => {
        testData = await connection('test_data')
        .update({
          test_status: test_data.test_status,
          test_type: test_data.test_type,
          final_classification: test_data.final_classification,
          test_result: test_data.test_result,
          collection_date: test_data.collection_date,
          updated_at: connection.fn.now()
        }, ['id', 'patient_id'])
        .where('id', test_data.id).where('patient_id', test_data.patient_id).transacting(trx);
        let patient_id = test_data.patient_id;
        await connection('fixed_reports')
          .where('patient_id', patient_id)
          .update({
            status: status,
            updated_at: connection.fn.now()
            }, ['id'])
          .transacting(trx);
      });
    } catch (error) {
      throw error;
    }
    return testData;
  }
  const list = async (patient_id) => {
    let test;
    try {
       test = await connection('test_data')
        .select('*')
        .where({patient_id});
    } catch (error) {
      throw error;
    }
    return test;
  }
  return {
    update,
    list
  }
};
module.exports = TestData();
