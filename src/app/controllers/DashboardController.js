const PatientModel = require('../models/Patient');

function getRiskAndStatus(patients){
  const data = {
    risks: {
      low: 0,
      medium: 0,
      high: 0,
      critic: 0
    },
    status: {
      suspect: 0,
      monitored: 0,
      infected: 0,
      discarded_by_isolation: 0,
      discarded_by_test: 0,
      cured: 0,
      death: 0,
    },
    genre: {
      male: 0,
      female: 0
    },
    address: []
  }
  patients.map(patient => {
    data.status[patient.status]++;
    data.genre[patient.genre]++;
    data.risks[patient.risk]++;
    data.address[patient.address] = data.address[patient.address] ? data.address[patient.address]++ :  1;
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
