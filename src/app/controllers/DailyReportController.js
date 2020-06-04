const Patient = require('../models/Patient');
const DailyReport = require('../models/DailyReport');
const { validationResult } = require('express-validator')

module.exports = {
    async create(req, res) {
        if (req.userPermission !== 'patient') return res.status(401).json({ error: 'Not authorized' })
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
        const {
	    fever,
            cough,
            difficulty_breathing,
            sputum_production,
            nasal_congestion,
            difficulty_swallowing,
            sore_throat,
            coryza,
            signs_of_cyanosis,
            drawing,
            intercostal,
            fatigue,
            myalgia_or_arthralgia,
            headache,
            chill,
            red_spots_on_the_body,
            enlarged_lymph_nodes,
            diarrhea,
            nausea,
            vomiting,
            dehydration,
            inappetence,
            loss_of_taste,
            loss_of_smell,
            others
        } = req.body;

        const daily_report = {
	    fever,
            cough,
            difficulty_breathing,
            sputum_production,
            nasal_congestion,
            difficulty_swallowing,
            sore_throat,
            coryza,
            signs_of_cyanosis,
            drawing,
            intercostal,
            fatigue,
            myalgia_or_arthralgia,
            headache,
            chill,
            red_spots_on_the_body,
            enlarged_lymph_nodes,
            diarrhea,
            nausea,
            vomiting,
            dehydration,
            inappetence,
            loss_of_taste,
            loss_of_smell,
            others
        }
        const existsPatient = await Patient.list(req.userId);
        if (!existsPatient) return res.status(401).json({ error: 'Patients not exists' });
        const dailyReportId = await DailyReport.store(daily_report, req.userId);
        return res.json(dailyReportId);
    },

    async list(req, res) {
        let { date, patient, reportId } = req.query;
        let daily_report
        if (!date) {
            date = new Date()
        }
        try {
            daily_report = await DailyReport.listByDateAndPatient(patient, date, reportId)

        } catch (err) {
            return res.status(500).json({ error: 'Can not store in database' })
        }
	daily_report.map(daily => daily.password = undefined);

        return res.json(daily_report)
    },

    async update(req, res) {
        let { reportId } = req.params;
        let daily_report
        try {
            daily_report = await DailyReport.updateStatusAndRisk(reportId);
        } catch (err) {
            return res.status(500).json({ error: 'Can not update' })
        }
        return res.json(daily_report)
    }
}
