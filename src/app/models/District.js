const connection = require('../../database/connection');

class District {
  async store(name, zone) {
    const districtId = await connection('districts')
      .insert({
        name,
        zone,
      })
      .returning('id');
    return districtId;
  }

  async list(zone) {
    const query = connection('districts').select('id', 'name', 'zone');
    if (zone) {
      query.where({ zone });
    }
    const districts = await query;
    return districts;
  }
}

module.exports = District;
