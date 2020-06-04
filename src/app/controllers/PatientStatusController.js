const PatientModel = require('../models/Patient');
const { validationResult } = require('express-validator');
module.exports = {
  async update(req, res){
    if (req.userPermission !== 'secretary') return res.status(401).json({ error: 'Not authorized' })
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
    const {status, risk} = req.body;
    const { patientId } = req.params;
    let updatedPatient
    try {
      updatedPatient = await PatientModel.updateStatusAndRisk(patientId, status, risk);
    } catch (error) {
      return res.status(500).json({ error: 'Can not update data' })
    }
    return res.json(updatedPatient);
  }
}