const { validationResult } = require('express-validator');
const TestDataModel = require('../models/TestData');

module.exports = {
  async update(req, res) {
    if (
      req.userPermission !== 'secretary' &&
      req.userPermission !== 'test_center'
    )
      return res.status(401).json({ error: 'Not authorized' });
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    const { test_data, status } = req.body;
    const { testId, patientId } = req.params;
    test_data.id = parseInt(testId);
    test_data.patient_id = patientId;
    let testData;
    try {
      testData = await TestDataModel.update(test_data, status);
    } catch (error) {
      return res.status(500).json({ error: 'Can not update' });
    }
    return res.json(testData);
  },

  async index(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    const { patientId } = req.query;
    let testData;
    try {
      testData = await TestDataModel.list(patientId);
    } catch (error) {
      return res.status(500).json({ error: 'Can not list' });
    }
    return res.json(testData);
  },
};
