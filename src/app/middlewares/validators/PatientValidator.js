const { check } = require('express-validator');
const cpfValidator = require('cpf-cnpj-validator');
const Patient = require('../../models/Patient');
const DailyReportValidator = require('./DailyReportValidator');
const TestDataValidator = require('./TestDataValidator');

const common = [
  check('patient.name')
    .notEmpty()
    .isLength({ min: 5 })
    .withMessage('O nome do paciente é muito curto!')
    .trim()
    .escape(),
  check('patient.monther_name')
    .optional({ nullable: true })
    .isLength({ min: 5 })
    .withMessage('O nome da mãe é muitco curto!')
    .trim()
    .escape(),
  check('patient.has_cpf').optional().isBoolean(),
  check('patient.is_foreign').optional().isBoolean(),
  check('patient.cbo').optional().trim().escape(),
  check('patient.cns').optional().trim().escape(),
  check('patient.healthcare_professional').optional().isBoolean(),
  check('patient.phone_number')
    .optional({ nullable: true })
    .isMobilePhone('pt-BR')
    .withMessage('Número de telefone inválido!'),
  check('patient.whatsapp')
    .optional({ nullable: true })
    .isMobilePhone('pt-BR')
    .withMessage('Número de telefone inválido!'),
  check('patient.origin_country').optional().trim().escape(),
  check('patient.passport').optional().trim().escape(),
  check('patient.genre').notEmpty().trim().isIn(['masculino', 'feminino']),
  check('address.address').optional().escape().trim(),
  check('address.street').optional().escape().trim(),
  check('address.number').optional().escape(),
  check('address.complement').optional().escape().trim(),
  check('patient.birthday')
    .notEmpty()
    .toDate()
    .withMessage('Data de nascimento inválida!'),
  check('fixed_report.blood_glucose').optional().trim().escape(),
  check('fixed_report.blood_pressure').optional().trim().escape(),
  check('fixed_report.temperature').optional().trim().escape(),
  check('fixed_report.heart_rate').optional().trim().escape(),
  check('fixed_report.oxygen_saturation').optional().trim().escape(),
  check('fixed_report.household_contacts').optional().trim().escape(),
  check('fixed_report.additional_notes').optional().trim().escape(),
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

const store = [
  ...common,
  ...DailyReportValidator,
  ...TestDataValidator,

  check('patient.cpf')
    .optional({ nullable: true })
    .isNumeric()
    .isLength({ min: 8 })
    .custom(async (cpf) => {
      const existsPatient = await Patient.verifyIfAlreadExists(cpf);
      const valid = cpfValidator.cpf.isValid(cpf);
      if (existsPatient) {
        throw new Error('Esse cpf já está cadastrado!');
      }
      if (!valid) {
        throw new Error('Cpf inválido!');
      }
    }),

  check('fixed_report.recent_travel').notEmpty().isBoolean(),
  check('fixed_report.traveled_to_city').optional().trim().escape(),
  check('fixed_report.professional_name').optional().trim().escape(),
  check('fixed_report.recent_contact').notEmpty().isBoolean(),
  check('fixed_report.screening_day').notEmpty().toDate(),
  check('fixed_report.symptom_onset_date').notEmpty().toDate(),
];

const update = common;

const login = [
  check('cpf')
    .notEmpty()
    .isNumeric()
    .withMessage('O cpf é inválido!')
    .isLength({ min: 8 })
    .custom((cpf) => {
      const valid = cpfValidator.cpf.isValid(cpf);
      return valid;
    }),

  check('birthday').notEmpty().toDate(),
];

module.exports = {
  store,
  update,
  login,
};
