const { isToday, differenceInDays } = require('date-fns');
const PatientModel = require('../models/Patient');

function getRiskAndStatus(patients, permission) {
  const data_test = {
    test_type: {
      teste_rapido_anticorpo: 0,
      teste_rapido_antigeno: 0,
      rt_pcr: 0,
    },
    test_status: {
      solicitado: 0,
      coletado: 0,
      concluido: 0,
    },
    need_test: 0,
    test_result: {
      positivo: 0,
      negativo: 0,
    },
    final_classification: {
      nao_definido: 0,
      confirmacao_laboratorial: 0,
      confirmacao_clinico_epidemiologico: 0,
      descartado: 0,
    },
    today_test: {
      test_status: {
        solicitado: 0,
        coletado: 0,
        concluido: 0,
      },
    },
  };
  let data = {};
  if (permission === 'test_center') {
    data = data_test;
    patients.map((patient) => {
      data.test_type[patient.test_type]++;
      data.test_status[patient.test_status]++;
      data.final_classification[patient.final_classification]++;
      data.today_test.test_status[patient.status] += isToday(
        Date.parse(patient.test_update)
      )
        ? 1
        : 0;
      patient.test_result !== null
        ? patient.test_result
          ? data.test_result.positivo++
          : data.test_result.negativo++
        : null;
      data.need_test +=
        differenceInDays(new Date(), patient.symptom_onset_date) >= 10 ? 1 : 0;
    });
  } else {
    data = {
      ...data_test,
      risks: {
        baixo: 0,
        medio: 0,
        alto: 0,
        critico: 0,
      },
      status: {
        suspeito: 0,
        internado: 0,
        infectado: 0,
        descartado_por_isolamento: 0,
        descartado_por_teste: 0,
        curado: 0,
        obito: 0,
        em_tratamento_domiciliar: 0,
        internado_em_uti: 0,
        ignorado: 0,
        cancelado: 0,
      },
      address: {
        urbana: {},
        rural: {},
      },
      genre: {
        masculino: 0,
        feminino: 0,
      },
      today: {
        status: {
          suspeito: 0,
          internado: 0,
          infectado: 0,
          descartado_por_isolamento: 0,
          descartado_por_teste: 0,
          curado: 0,
          obito: 0,
          em_tratamento_domiciliar: 0,
          internado_em_uti: 0,
          ignorado: 0,
          cancelado: 0,
        },
      },
    };
    patients.map((patient) => {
      data.status[patient.status]++;
      data.genre[patient.genre]++;
      if (patient.zone) {
        data.address[patient.zone][patient.address] = data.address[
          patient.zone
        ][patient.address]
          ? data.address[patient.zone][patient.address] + 1
          : 1;
      }

      data.risks[patient.risk]++;
      data.today.status[patient.status] += isToday(
        Date.parse(patient.test_update)
      )
        ? 1
        : 0;

      data.test_type[patient.test_type]++;
      data.test_status[patient.test_status]++;
      data.final_classification[patient.final_classification]++;
      data.today_test.test_status[patient.test_status] += isToday(
        Date.parse(patient.test_update)
      )
        ? 1
        : 0;
      patient.test_result !== null
        ? patient.test_result
          ? data.test_result.positivo++
          : data.test_result.negativo++
        : null;
      data.need_test +=
        patient.test_status === 'solicitado' &&
        differenceInDays(new Date(), patient.symptom_onset_date) >= 10
          ? 1
          : 0;
    });
  }
  return data;
}

module.exports = {
  async showDataOfAllPatients(req, res) {
    const { strategy_id } = req.headers;
    let patients;
    try {
      if (req.userPermission !== 'basic_unity') {
        patients = await PatientModel.listAll({});
      } else {
        patients = await PatientModel.listAll({ strategy_id });
      }
    } catch (err) {
      return res.status(500).json({ error: 'Internal server error' });
    }
    const patientFilteredData = getRiskAndStatus(patients, req.userPermission);
    return res.status(200).json(patientFilteredData);
  },
};
