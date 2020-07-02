const { addDays } = require('date-fns');
const connection = require('../../database/connection');

class Patient {
  async store(
    patient,
    address,
    fixed_report,
    daily_report,
    test_data,
    conditions
  ) {
    let patientId;
    await connection.transaction(async (trx) => {
      patientId = await connection('patients')
        .insert({
          strategy_id: patient.strategy_id,
          name: patient.name,
          cpf: patient.cpf,
          cbo: patient.cbo,
          cns: patient.cns,
          phone_number: patient.phone_number,
          whatsapp: patient.whatsapp,
          passport: patient.passport,
          genre: patient.genre,
          birthday: patient.birthday,
          monther_name: patient.monther_name,
          has_cpf: patient.has_cpf,
          is_foreign: patient.is_foreign,
          healthcare_professional: patient.healthcare_professional,
          origin_country: patient.origin,
        })
        .returning('id')
        .transacting(trx);
      const [id] = patientId;
      address.patient_id = id;
      await connection('addresses').insert(address).transacting(trx);
      daily_report.patient_id = id;
      daily_report.readed = true;
      const dailyReportId = await connection('daily_reports')
        .insert(daily_report)
        .returning('id')
        .transacting(trx);
      fixed_report.patient_id = id;
      fixed_report.symptoms_id = dailyReportId[0];
      await connection('fixed_reports').insert(fixed_report).transacting(trx);
      const patientConditions = conditions.map((condition) => ({
        condition_id: condition,
        patient_id: id,
      }));
      await connection('patient_conditions')
        .insert(patientConditions)
        .transacting(trx);
      test_data.patient_id = id;
      await connection('test_data').insert(test_data).transacting(trx);
    });
    return patientId;
  }

  async listAll({ page, name, date, strategy_id, status }) {
    const countQuery = connection('patients').count();
    const query = connection('patients')
      .join('addresses', 'patients.id', '=', 'addresses.patient_id')
      .join('fixed_reports', 'patients.id', '=', 'fixed_reports.patient_id')
      .join('test_data', 'patients.id', '=', 'test_data.patient_id')
      .leftJoin('districts', 'districts.id', '=', 'addresses.district_id')
      .select(
        'patients.id',
        'patients.name',
        'patients.monther_name',
        'patients.cpf',
        'patients.cbo',
        'patients.cns',
        'patients.phone_number',
        'patients.whatsapp',
        'patients.is_foreign',
        'patients.healthcare_professional',
        'patients.genre',
        'patients.birthday',
        'districts.name as address',
        'districts.zone as zone',
        'patients.passport',
        'patients.origin_country',
        'patients.created_at as creation_date',
        'patients.updated_at as update_date',
        'fixed_reports.id as fixed_report_id',
        'fixed_reports.recent_travel',
        'fixed_reports.traveled_to_city',
        'fixed_reports.recent_contact',
        'fixed_reports.screening_day',
        'fixed_reports.symptom_onset_date',
        'fixed_reports.risk',
        'fixed_reports.status',
        'test_data.id as test_id',
        'test_data.test_status',
        'test_data.test_type',
        'test_data.test_result',
        'test_data.final_classification',
        'test_data.collection_date',
        'test_data.closing_date',
        'test_data.created_at as test_creation',
        'test_data.updated_at as test_update'
      );
    if (page) {
      query.limit(20).offset((page - 1) * 20);
    }
    if (name) {
      query.andWhere('patients.name', 'like', `%${name}%`);
      countQuery.andWhere('patients.name', 'like', `%${name}%`);
    }
    if (status) {
      query.where('fixed_reports.status', status);
    }
    if (strategy_id) {
      query.where('patients.strategy_id', strategy_id);
      countQuery.where('patients.strategy_id', strategy_id);
    }
    if (date) {
      const afterDate = addDays(new Date(date), 1);
      query.whereBetween('patients.created_at', [new Date(date), afterDate]);
      countQuery.whereBetween('patients.created_at', [date, afterDate]);
    }
    const patients = await query;
    const count = await countQuery;
    patients.count = count;
    return patients;
  }

  async list(id) {
    const patient = await connection('patients')
      .join('addresses', 'patients.id', '=', 'addresses.patient_id')
      .join('fixed_reports', 'patients.id', '=', 'fixed_reports.patient_id')
      .join('test_data', 'patients.id', '=', 'test_data.patient_id')
      .leftJoin('districts', 'districts.id', '=', 'addresses.district_id')
      .select(
        'patients.id',
        'patients.name',
        'patients.monther_name',
        'patients.cpf',
        'patients.cbo',
        'patients.cns',
        'patients.phone_number',
        'patients.whatsapp',
        'patients.is_foreign',
        'patients.healthcare_professional',
        'patients.genre',
        'patients.birthday',
        'patients.passport',
        'patients.origin_country',
        'patients.created_at as creation_date',
        'patients.updated_at as update_date',
        'districts.name as address',
        'districts.zone as zone',
        'addresses.street',
        'addresses.number',
        'addresses.complement',
        'addresses.cep',
        'fixed_reports.id as fixed_report_id',
        'fixed_reports.symptoms_id',
        'fixed_reports.recent_travel',
        'fixed_reports.traveled_to_city',
        'fixed_reports.recent_contact',
        'fixed_reports.screening_day',
        'fixed_reports.symptom_onset_date',
        'fixed_reports.risk',
        'fixed_reports.status',
        'fixed_reports.blood_glucose',
        'fixed_reports.blood_pressure',
        'fixed_reports.temperature',
        'fixed_reports.heart_rate',
        'fixed_reports.oxygen_saturation',
        'fixed_reports.household_contacts',
        'fixed_reports.professional_name',
        'fixed_reports.additional_notes',
        'test_data.id as test_id',
        'test_data.test_status',
        'test_data.test_type',
        'test_data.test_result',
        'test_data.final_classification',
        'test_data.collection_date',
        'test_data.closing_date',
        'test_data.created_at as test_creation',
        'test_data.updated_at as test_update'
      )
      .where('patients.id', id)
      .limit(1)
      .first();

    const conditions = await connection('conditions')
      .join(
        'patient_conditions',
        'patient_conditions.condition_id',
        '=',
        'conditions.id'
      )
      .where('patient_conditions.patient_id', id)
      .select('title');
    patient.conditions = conditions;
    return patient;
  }

  async findByCpf(cpf) {
    const patient = await connection('patients')
      .select('id', 'name', 'cpf', 'created_at', 'birthday')
      .where('cpf', cpf)
      .limit(1)
      .first();
    return patient;
  }

  async verifyIfAlreadExists(cpf) {
    const patient = await this.findByCpf(cpf);
    if (patient) return true;
    return false;
  }

  async deleteAll() {
    await connection.transaction(async (trx) => {
      await connection('patients').truncate().transacting(trx);
      await connection('addresses').truncate().transacting(trx);
      await connection('fixed_reports').truncate().transacting(trx);
      await connection('daily_reports').truncate().transacting(trx);
    });
  }

  async update(patient, address, strategy_id, fixedReport) {
    let patientId;
    await connection.transaction(async (trx) => {
      patientId = await connection('patients')
        .where('id', patient.id)
        .update(
          {
            name: patient.name,
            monther_name: patient.monther_name,
            cpf: patient.cpf,
            cbo: patient.cbo,
            cns: patient.cns,
            phone_number: patient.phone_number,
            whatsapp: patient.whatsapp,
            passport: patient.passport,
            genre: patient.genre,
            birthday: patient.birthday,
            updated_at: connection.fn.now(),
          },
          ['id']
        )
        .transacting(trx);
      await connection('addresses')
        .update({ ...address, updated_at: connection.fn.now() }, ['id'])
        .where('patient_id', patient.id)
        .transacting(trx);
      await connection('fixed_reports')
        .update({ ...fixedReport, updated_at: connection.fn.now() }, ['id'])
        .where('patient_id', patient.id)
        .transacting(trx);
    });
    return patientId;
  }

  async updateStatusAndRisk(patient_id, status, risk) {
    const patientId = await connection('fixed_reports')
      .where('patient_id', patient_id)
      .update(
        {
          risk,
          status,
          updated_at: connection.fn.now(),
        },
        ['id']
      );

    return patientId;
  }

  async deleteById(id) {
    await connection.transaction(async (trx) => {
      await connection('patients').where('id', id).del().transacting(trx);
      await connection('addresses')
        .where('patient_id', id)
        .del()
        .transacting(trx);
      await connection('fixed_reports')
        .where('patient_id', id)
        .del()
        .transacting(trx);
      await connection('daily_reports')
        .where('patient_id', id)
        .del()
        .transacting(trx);
    });

    return true;
  }
}

module.exports = new Patient();
