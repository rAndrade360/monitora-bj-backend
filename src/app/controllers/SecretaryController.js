const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const SecretaryModel = require('../models/Secretary');
const generateToken = require('./utils/generateToken');

module.exports = {
  async login(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    const { access_id, password } = req.body;
    const Secretary = await SecretaryModel.find(access_id);
    if (!Secretary)
      return res.status(401).json({ error: 'Invalid id or password' });
    const isEqual = bcrypt.compareSync(password, Secretary.password);
    if (!isEqual) return res.status(401).json({ error: 'Invalid password' });
    const token = generateToken(Secretary.id, 'secretary');
    return res.json({
      token,
      type: 'Bearer',
      user: {
        id: Secretary.id,
        acess_id: Secretary.acess_id,
        name: 'Secretaria Municipal de Saúde',
        permission: 'secretary',
      },
    });
  },

  async resetPassword(req, res) {
    const { secretary_id } = req.headers;
    if (
      req.userPermission !== 'secretary' ||
      parseInt(req.userId) !== parseInt(secretary_id)
    ) {
      return res.status(401).json({ error: 'Not authorized' });
    }
    const { oldPassword, newPassword } = req.body;
    const Secretary = await SecretaryModel.find(acess_id);
    if (!Secretary)
      return res.status(400).json({ error: 'Invalid id or password' });
    const isEqual = bcrypt.compareSync(oldPassword, Secretary.password);
    if (!isEqual) return res.status(401).json({ error: 'Invalid password' });
    let newSecretary;
    try {
      newSecretary = await SecretaryModel.resetPassword(
        secretary_id,
        newPassword
      );
    } catch (err) {
      return res.status(500).json({ error: 'Can not reset password' });
    }
    return res.json(newSecretary);
  },
};
