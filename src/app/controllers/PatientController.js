const PatientModel = require('../models/Patient');
const { validationResult } = require('express-validator');
module.exports = {
    async create(req, res) {
        if (req.userPermission !== 'secretary') return res.status(401).json({ error: 'Not authorized' })
        const { patient, address, fixed_report } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
        let patientId;
        try {
            patientId = await PatientModel.store(patient, address, fixed_report);
        } catch (err) {
            return res.status(500).json({ error: 'Can not store in database' });
        }
        return res.json(patientId);
    },

    async index(req, res) {
        if (req.userPermission !== 'secretary') return res.status(401).json({ error: 'Not authorized' })
	const {page = 1, name = ''} = req.query;
        let patient
        try {
            patient = await PatientModel.listAll(page, name);
        } catch (err) {
            return res.status(500).json({ error: 'Can not load patients' })
        }
	const count = patient.count
	patient.count = undefined;
        return res.json({patient, count });
    },

    async show(req, res) {
        const { id } = req.params;
        const patientId = parseInt(id)
        let patient
        try {
            patient = await PatientModel.list(patientId)
        } catch (err) {
            return res.status(500).json({ error: 'Can not load patient' })
        }
        return res.json(patient)
    },

    async update(req, res) {
        if (req.userPermission !== 'secretary') return res.status(401).json({ error: 'Not authorized' })
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
        const { id } = req.params;
        const { patient, address } = req.body;
        const updateId = parseInt(id)
        let patientId
        try {
            patientId = await PatientModel.update(patient, address, updateId)
        } catch (error) {
            return res.status(500).json({ error: 'Can not update patient' })
        }
        return res.json(patientId);
    },

    async delete(req, res) {
        if (req.userPermission !== 'secretary') return res.status(401).json({ error: 'Not authorized' })
        const { id } = req.params
        try {
            await PatientModel.deleteById(id)
        } catch (error) {
            return res.status(500).json({ error: 'Can not delete patient', deleted: false })
        }
        return res.json({ deleted: true })
    }

}
