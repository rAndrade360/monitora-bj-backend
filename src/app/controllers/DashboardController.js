const PatientModel = require('../models/Patient');
const { isToday, toDate, parseISO } = require('date-fns');

function getRiskAndStatus(patients){
  const data = {
    risks: {
      baixo: 0,
      medio: 0,
      alto: 0,
      critico: 0
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
      cancelado: 0
    },
    genre: {
      masculino: 0,
      feminino: 0
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
        cancelado: 0
      },
    }
  }
  patients.map(patient => {
    data.status[patient.status]++;
    data.genre[patient.genre]++;
    data.risks[patient.risk]++;
    data.today.status[patient.status] += isToday(Date.parse(patient.test_update)) ? 1 : 0;
  })
  return data;
}

module.exports = {
  async showDataOfAllPatients(req, res){
    let patients;
    try{
      patients = await PatientModel.listAll();
    }catch(err){
      return res.status(500).json({error: 'Internal server error'});
    }
    const patientFilteredData = getRiskAndStatus(patients);
    return res.status(200).json(patientFilteredData);
  }
}
