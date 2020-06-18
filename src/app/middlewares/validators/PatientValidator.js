const { check } = require('express-validator');
const cpf_validator = require('cpf-cnpj-validator');
const Patient = require('../../models/Patient');
const DailyReportValidator = require('./DailyReportValidator');
const TestDataValidator = require('./TestDataValidator');

const common = [
  check('patient.name')
    .notEmpty()
    .isLength({ min: 5 })
    .withMessage('Invalid name')
    .trim()
    .escape(),

  check('patient.monther_name')
    .notEmpty()
    .isLength({ min: 5 })
    .withMessage('Invalid monther name')
    .trim()
    .escape(),

  check('patient.has_cpf').optional().isBoolean(),

  check('patient.is_foreign').optional().isBoolean(),

  check('patient.cbo').optional().trim().escape(),

  check('patient.cns').optional().trim().escape(),

  check('patient.healthcare_professional').optional().isBoolean(),

  check('patient.phone_number').optional().isMobilePhone('pt-BR'),

  check('patient.whatsapp').optional().isMobilePhone('pt-BR'),

  check('patient.origin_country').optional().trim().escape(),

  check('patient.passport').optional().trim().escape(),

  check('patient.genre').notEmpty().trim().isIn(['masculino', 'feminino']),

  check('address.address').notEmpty().escape().trim().isLength({ min: 3 }),

  check('address.street').notEmpty().escape().trim().isLength({ min: 3 }),

  check('address.number').notEmpty().isNumeric(),

  check('address.complement').optional().escape().trim(),

  check('patient.birthday').notEmpty().toDate(),

  check('address.address').notEmpty().escape().trim().isLength({ min: 3 }),
];

const store = [
  ...common,
  ...DailyReportValidator,
  ...TestDataValidator,

  check('patient.cpf')
    .notEmpty()
    .isNumeric()
    .isLength({ min: 8 })
    .withMessage('Invalid cpf')
    .custom(async (cpf) => {
      const existsPatient = await Patient.verifyIfAlreadExists(cpf);
      const valid = cpf_validator.cpf.isValid(cpf);
      if (existsPatient) {
        throw new Error('Patient already exists');
      }
      if (!valid) {
        throw new Error('Invalid cpf');
      }
    }),

  check('fixed_report.recent_travel').notEmpty().isBoolean(),

  check('fixed_report.traveled_to_city').optional().trim().escape(),

  check('fixed_report.recent_contact').notEmpty().isBoolean(),

  check('fixed_report.screening_day').notEmpty().toDate(),

  check('fixed_report.symptom_onset_date').notEmpty().toDate(),

  check('fixed_report.risk')
    .notEmpty()
    .isIn(['baixo', 'medio', 'alto', 'critico']),

  check('fixed_report.status')
    .notEmpty()
    .isIn([
      'suspeito',
      'internado',
      'descartado_por_isolamento',
      'descartado_por_teste',
      'curado',
      'obito',
      'em_tratamento_domiciliar',
      'internado_em_uti',
      'ignorado',
      'cancelado',
    ]),
];

const update = common;

const login = [
  check('cpf')
    .notEmpty()
    .isNumeric()
    .isLength({ min: 8 })
    .custom((cpf) => {
      const valid = cpf_validator.cpf.isValid(cpf);
      return valid;
    }),

  check('birthday').notEmpty().toDate(),
];

module.exports = {
  store,
  update,
  login,
};
