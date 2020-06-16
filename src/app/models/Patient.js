const connection = require('../../database/connection');

const Patient = () => {
  const store = async (
    patient,
    address,
    fixed_report,
    daily_report,
    test_data,
    conditions
  ) => {
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
      address.patient_id = patientId[0];
      await connection('addresses').insert(address).transacting(trx);
      daily_report.patient_id = patientId[0];
      daily_report.readed = true;
      const dailyReportId = await connection('daily_reports')
        .insert(daily_report)
        .returning('id')
        .transacting(trx);
      fixed_report.patient_id = patientId[0];
      fixed_report.symptoms_id = dailyReportId[0];
      await connection('fixed_reports').insert(fixed_report).transacting(trx);
      const patientConditions = conditions.map((condition) => ({
        condition_id: condition,
        patient_id: patientId[0],
      }));
      await connection('patient_conditions')
        .insert(patientConditions)
        .transacting(trx);
      test_data.patient_id = patientId[0];
      await connection('test_data').insert(test_data).transacting(trx);
    });
    return patientId;
  };

  const listAll = async ({ page = 1, name, date, strategy_id }) => {
    const countQuery = connection('patients').count();
    const query = connection('patients')
      .join('addresses', 'patients.id', '=', 'addresses.patient_id')
      .join('fixed_reports', 'patients.id', '=', 'fixed_reports.patient_id')
      .join('test_data', 'patients.id', '=', 'test_data.patient_id')
      .select(
        'patients.id',
        'patients.name',
        'patients.cpf',
        'patients.cbo',
        'patients.phone_number',
        'patients.genre',
        'patients.birthday',
        'addresses.address',
        'addresses.street',
        'addresses.number',
        'addresses.complement',
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
      )
      .limit(20)
      .offset((page - 1) * 20);
    if (name) {
      query.andWhere('name', 'like', `%${name}%`);
    }
    if (strategy_id) {
      query.where('strategy_id', strategy_id);
      countQuery.where('strategy_id', strategy_id);
    }
    if (date) {
      query.where('created_at', new Date());
    }
    const patients = await query;
    const count = await countQuery;
    patients.count = count;
    return patients;
  };

  const list = async (id) => {
    const patient = await connection('patients')
      .join('addresses', 'patients.id', '=', 'addresses.patient_id')
      .join('fixed_reports', 'patients.id', '=', 'fixed_reports.patient_id')
      .join('test_data', 'patients.id', '=', 'test_data.patient_id')
      .select(
        'patients.id',
        'patients.name',
        'patients.monther_name',
        'patients.cpf',
        'patients.cbo',
        'patients.phone_number',
        'patients.genre',
        'patients.birthday',
        'addresses.address',
        'addresses.street',
        'addresses.number',
        'addresses.complement',
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
  };

  const findByCpf = async (cpf) => {
    const patient = await connection('patients')
      .select('id', 'name', 'cpf', 'created_at', 'birthday')
      .where('cpf', cpf)
      .limit(1)
      .first();
    return patient;
  };

  const verifyIfAlreadExists = async (cpf) => {
    const patient = await findByCpf(cpf);
    if (patient) return true;
    return false;
  };

  const deleteAll = async () => {
    await connection.transaction(async (trx) => {
      await connection('patients').truncate().transacting(trx);
      await connection('addresses').truncate().transacting(trx);
      await connection('fixed_reports').truncate().transacting(trx);
      await connection('daily_reports').truncate().transacting(trx);
    });
  };

  const update = async (patient, address, id, strategy_id) => {
    let patientId;
    await connection.transaction(async (trx) => {
      patientId = await connection('patients')
        .where('id', id)
        .update(
          {
            name: patient.name,
            phone_number: patient.phone_number,
            genre: patient.genre,
            birthday: new Date(patient.birthday),
            updated_at: connection.fn.now(),
          },
          ['id']
        )
        .where('strategy_id', strategy_id)
        .transacting(trx);
      await connection('addresses')
        .update(address, ['id'])
        .where('patient_id', id)
        .transacting(trx);
      await connection('fixed_reports')
        .update(
          {
            status: patient.status,
            risk: patient.risk,
          },
          ['id']
        )
        .where('patient_id', id)
        .transacting(trx);
    });
    return patientId;
  };

  const updateStatusAndRisk = async (patient_id, status, risk) => {
    const patientId = await connection('fixed_reports')
      .where('pateint_id', patient_id)
      .update(
        {
          risk,
          status,
          updated_at: connection.fn.now(),
        },
        ['id']
      );

    return patientId;
  };

  const deleteById = async (id) => {
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
  };

  return {
    store,
    listAll,
    verifyIfAlreadExists,
    deleteById,
    deleteAll,
    list,
    update,
    findByCpf,
    updateStatusAndRisk,
  };
};

module.exports = Patient();
