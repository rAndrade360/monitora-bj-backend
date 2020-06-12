const { check } = require('express-validator');

module.exports = [
  check('test_data.test_status')
    .isAlpha('pt-BR')
    .trim()
    .notEmpty()
    .escape()
    .isIn(['solicitado', 'coletado', 'concluido']),

  check('test_data.test_type')
    .trim()
    .notEmpty()
    .isIn(['teste_rapido_anticorpo', 'teste_rapido_antigeno', 'rt_pcr']),

  check('test_data.test_result')
    .isBoolean()
    .optional(),

  check('test_data.final_classification')
    .optional()
    .trim()
    .escape()
    .isIn([
      'nao_definido',
      'confirmacao_laboratorial',
      'confirmacao_clinico_epidemiologico',
      'descartado']
    ),

  check('test_data.collection_date')
      .toDate()
      .optional(),

  check('test_data.closing_date')
      .toDate()
      .optional()


  
]