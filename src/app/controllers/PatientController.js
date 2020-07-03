const { validationResult } = require('express-validator');
const PatientModel = require('../models/Patient');

module.exports = {
  async create(req, res) {
    if (
      req.userPermission !== 'secretary' &&
      req.userPermission !== 'basic_unity'
    ) {
      return res.status(401).json({ error: 'Not authorized' });
    }
    const {
      patient,
      address,
      fixed_report,
      daily_report,
      test_data,
      conditions,
    } = req.body;
    const { strategy_id } = req.headers;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    patient.strategy_id = parseInt(strategy_id);
    let patientId;
    try {
      patientId = await PatientModel.store(
        patient,
        address,
        fixed_report,
        daily_report,
        test_data,
        conditions
      );
    } catch (err) {
      return res.status(500).json({ error: 'Can not store in database' });
    }
    return res.json(patientId);
  },

  async index(req, res) {
    if (req.userPermission === 'patient')
      return res.status(401).json({ error: 'Not authorized' });
    const { page, name = '', date, status } = req.query;
    const { strategy_id } = req.headers;
    let patient;
    const patientStore = {
      page,
      name,
      date,
      status,
      strategy_id:
        req.userPermission === 'test_center'
          ? undefined
          : parseInt(strategy_id),
    };
    try {
      patient = await PatientModel.listAll(patientStore);
    } catch (err) {
      return res.status(500).json({ error: 'Can not load patients' });
    }
    const { count } = patient;
    res.header('X-Total-Count', count[0].count);
    patient.count = undefined;
    return res.json(patient);
  },

  async show(req, res) {
    const { id } = req.params;
    const patientId = parseInt(id);
    let patient;
    try {
      patient = await PatientModel.list(patientId);
    } catch (err) {
      return res.status(500).json({ error: 'Can not load patient' });
    }
    return res.json(patient);
  },

  async update(req, res) {
    if (
      req.userPermission !== 'secretary' &&
      req.userPermission !== 'basic_unity'
    ) {
      return res.status(401).json({ error: 'Not authorized' });
    }
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    const { id } = req.params;
    const { patient, address, fixed_report } = req.body;
    const { strategy_id } = req.headers;
    patient.id = parseInt(id);
    let patientId;
    try {
      patientId = await PatientModel.update(
        patient,
        address,
        strategy_id,
        fixed_report
      );
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Can not update patient' });
    }
    return res.json(patientId);
  },

  async delete(req, res) {
    if (
      req.userPermission !== 'secretary' &&
      req.userPermission !== 'basic_unity'
    ) {
      return res.status(401).json({ error: 'Not authorized' });
    }
    const { id } = req.params;

    try {
      await PatientModel.deleteById(id);
    } catch (error) {
      return res
        .status(500)
        .json({ error: 'Can not delete patient', deleted: false });
    }
    return res.json({ deleted: true });
  },
};
