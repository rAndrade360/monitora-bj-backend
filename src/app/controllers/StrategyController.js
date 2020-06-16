const { validationResult } = require('express-validator');
const StrategyModel = require('../models/Strategy');

module.exports = {
  async create(req, res) {
    if (req.userPermission !== 'secretary')
      return res.status(401).json({ error: 'Not authorized' });
    const errors = validationResult(req.body);
    if (!errors.isEmpty())
      return res.status(400).json({ error: errors.array() });
    const { strategy } = req.body;
    let strategyId;
    try {
      strategyId = await StrategyModel.store(strategy);
    } catch (error) {
      return res.status(500).json({ error: 'Can not store in database' });
    }
    return res.json(strategyId);
  },
  async index(req, res) {
    if (req.userPermission !== 'secretary')
      return res.status(401).json({ error: 'Not authorized' });
    let strategies;
    try {
      strategies = await StrategyModel.listAll();
    } catch (error) {
      return res.status(500).json({ error: 'Can not load' });
    }
    return res.json(strategies);
  },
};
