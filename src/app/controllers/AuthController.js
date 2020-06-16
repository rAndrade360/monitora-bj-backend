const { validationResult } = require('express-validator');
const { isSameDay } = require('date-fns');
const bcrypt = require('bcrypt');
const PatientModel = require('../models/Patient');
const StrategyModel = require('../models/Strategy');
const generateToken = require('./utils/generateToken');

module.exports = {
  async loginPatient(req, res) {
    const { cpf, birthday } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    const patient = await PatientModel.findByCpf(cpf);
    if (!patient)
      return res.status(401).json({ error: 'Invalid cpf or birthday' });
    const Equal = isSameDay(patient.birthday, birthday);
    if (!Equal) return res.status(401).json({ error: 'Invalid data' });
    const token = generateToken(patient.id, 'patient');
    return res.json({
      token,
      type: 'Bearer',
      user: {
        name: patient.name,
        cpf,
        created_at: patient.created_at,
        birthday: patient.birthday,
      },
    });
  },

  async loginStrategy(req, res, next) {
    const { access_id, password } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    const strategy = await StrategyModel.findByAccesId(access_id);
    if (!strategy) next();
    const Equal = bcrypt.compareSync(password, strategy.password);
    if (Equal){ 
    const token = generateToken(strategy.id, strategy.permission);
    return res.json({
      token,
      type: 'Bearer',
      user: {
        name: strategy.name,
        id: strategy.id,
        access_id,
        permission: strategy.permission
      },
    });
    }
    next();
  },
};
