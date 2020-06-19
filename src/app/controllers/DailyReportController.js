const { validationResult } = require('express-validator');
const Patient = require('../models/Patient');
const DailyReport = require('../models/DailyReport');

module.exports = {
  async create(req, res) {
    if (req.userPermission !== 'patient')
      return res.status(401).json({ error: 'Not authorized' });
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    const { daily_report } = req.body;
    const existsPatient = await Patient.list(req.userId);
    if (!existsPatient)
      return res.status(401).json({ error: 'Patients not exists' });
    const dailyReportId = await DailyReport.store(daily_report, req.userId);
    return res.json(dailyReportId);
  },

  async list(req, res) {
    let { date, patient, reportId } = req.query;
    let daily_report;
    if (!date) {
      date = new Date();
    }
    try {
      daily_report = await DailyReport.listByDateAndPatient(
        patient,
        date,
        reportId
      );
    } catch (err) {
      return res.status(500).json({ error: 'Can not get of database' });
    }
    daily_report.map((daily) => (daily.password = undefined));

    return res.json(daily_report);
  },

  async update(req, res) {
    const { reportId } = req.params;
    let daily_report;
    try {
      daily_report = await DailyReport.update(reportId);
    } catch (err) {
      return res.status(500).json({ error: 'Can not update' });
    }
    return res.json(daily_report);
  },
};
