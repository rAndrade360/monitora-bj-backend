const connection = require('../../database/connection');

const Secretary = () => {
  const find = async (acess_id) => {
    const secretary = await connection('secretaries')
      .select('id', 'password')
      .where({ acess_id })
      .limit(1)
      .first();

    return secretary;
  };
  const resetPassword = async (id, password) => {
    const secretary = await connection('secretaries')
      .where('id', id)
      .update({ password }, ['id', 'acess_id']);

    return secretary;
  };
  return {
    find,
    resetPassword,
  };
};

module.exports = Secretary();
