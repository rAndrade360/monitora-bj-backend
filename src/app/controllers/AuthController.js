const PatientModel = require('../models/Patient');
const { validationResult } = require('express-validator');
const generateToken = require('./utils/generateToken');
const { isSameDay, format, getDay, getDate, parseJSON } = require('date-fns');
module.exports = {
    async loginPatient(req, res) {
     const { cpf, birthday } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })     
        const patient = await PatientModel.findByCpf(cpf);
        if (!patient) return res.status(401).json({ error: 'Invalid cpf or birthday' })
        const Equal = isSameDay(patient.birthday, birthday);
        if (!Equal) return res.status(401).json({ error: 'Invalid data' })
        const token = generateToken(patient.id, 'patient');
        return res.json({ token, type: 'Bearer', user: {name: patient.name, cpf, created_at: patient.created_at, birthday: patient.birthday} })
    }
}
