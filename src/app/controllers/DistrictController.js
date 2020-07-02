const District = require('../models/District');

const DistrictModel = new District();
class DistrictController {
  async store(req, res) {
    if (req.userPermission !== 'secretary')
      return res.status(401).json({ error: 'Not authorized' });
    const { name, zone } = req.body;
    let districtId;
    try {
      districtId = DistrictModel.store(name, zone);
    } catch (error) {
      return res.status(500).json({ error: 'Can not store in database!' });
    }
    return res.json(districtId);
  }

  async index(req, res) {
    const { zone } = req.query;
    let districts;
    try {
      districts = await DistrictModel.list(zone);
    } catch (error) {
      return res.status(500).json({ error: 'Can not load districts' });
    }
    return res.json(districts);
  }
}

module.exports = new DistrictController();
