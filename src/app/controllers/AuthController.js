const PatientModel = require('../models/Patient');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const generateToken = require('./utils/generateToken');
module.exports = {
    async loginPatient(req, res) {
 	const { cpf, password } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })     
        const patient = await PatientModel.findByCpf(cpf);
        if (!patient) return res.status(401).json({ error: 'Invalid cpf or password' })
        const isEqual = bcrypt.compareSync(password, patient.password)
        if (!isEqual) return res.status(401).json({ error: 'Invalid password' })
        const token = generateToken(patient.id, 'patient');
        return res.json({ token, type: 'Bearer', user: {name: patient.name, cpf, created_at: patient.created_at, status: patient.status, birthday: patient.birthday} })
    }
}
