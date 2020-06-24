const connection = require('../../database/connection');

const Strategy = () => {
  const store = async (strategy) => {
    const strategyId = await connection('strategies')
      .insert(strategy)
      .returning('id');

    return strategyId;
  };
  const listAll = async () => {
    const strategy = await connection('strategies').select(
      'id',
      'name',
      'permission',
      'access_id'
    );

    return strategy;
  };
  const findByAccesId = async (accessId) => {
    const strategy = await connection('strategies')
      .select('id', 'name', 'password', 'permission')
      .where('access_id', accessId)
      .first();

    return strategy;
  };

  return {
    store,
    findByAccesId,
    listAll,
  };
};

module.exports = Strategy();
