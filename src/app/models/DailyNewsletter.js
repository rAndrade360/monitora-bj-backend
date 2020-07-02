const { addDays } = require('date-fns');
const connection = require('../../database/connection');

class DailyNewsletter {
  async show({
    date,
    oldValue,
    newValue,
    strategy_id,
    patient_id,
    is_distinct,
    with_address,
  }) {
    let query;
    if (is_distinct === 'true') {
      const subquery = connection
        .select('patient_id')
        .max('created_at', { as: 'creation' })
        .as('logs')
        .whereNot('field_name', 'updated_at')
        .from('patient_logs')
        .groupBy('patient_id');
      query = connection
        .select(
          'field_name',
          'old_value',
          'new_value',
          'patient_logs.patient_id',
          'patient_logs.created_at'
        )
        .from(subquery)
        .whereNot('field_name', 'updated_at')
        .join('patient_logs', function () {
          this.on('patient_logs.patient_id', '=', 'logs.patient_id').andOn(
            'patient_logs.created_at',
            '=',
            'logs.creation'
          );
        });
    } else {
      query = connection('patient_logs')
        .select('*')
        .whereNot('field_name', 'updated_at');
    }
    if (date) {
      const afterDate = addDays(new Date(date), 1);
      query.whereBetween('patient_logs.created_at', [date, afterDate]);
    }
    if (oldValue) {
      query.where('old_value', oldValue);
    }
    if (with_address == 'true') {
      query
        .leftJoin(
          'addresses',
          'patient_logs.patient_id',
          'addresses.patient_id'
        )
        .leftJoin('districts', 'addresses.district_id', 'districts.id')
        .select('districts.name as address', 'districts.zone as zone');
    }
    if (newValue) {
      query.where('new_value', newValue);
    }
    if (strategy_id) {
      query.where(strategy_id);
    }
    if (patient_id) {
      query.where(patient_id);
    }
    const logs = await query;
    return logs;
  }
}

module.exports = DailyNewsletter;
