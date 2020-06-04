const { check } = require('express-validator');
const Patient = require('../../models/Patient');
const cpf_validator = require('cpf-cnpj-validator');
const generateHashedPassword = require('../../utils/generateHashedPassword');

const common = [
    check('patient.name')
        .notEmpty()
        .isLength({ min: 5 })
        .withMessage('Invalid name')
        .trim()
        .escape(),

    check('patient.phone_number')
        .notEmpty()
        .isMobilePhone('pt-BR'),

    check('patient.genre')
        .notEmpty()
        .trim()
        .isIn(['male', 'female']),

    check('address.address')
        .notEmpty()
        .escape()
        .trim()
        .isLength({ min: 3 }),

    check('address.street')
        .notEmpty()
        .escape()
        .trim()
        .isLength({ min: 3 }),

    check('address.number')
        .notEmpty()
        .isNumeric(),

    check('address.complement')
        .optional()
        .escape()
        .trim(),

    check('patient.birthday')
        .notEmpty()
        .toDate(),    

    check('patient.risk')
        .notEmpty()
        .isIn(['low', 'medium', 'high', 'critic']),

    check('patient.status')
        .notEmpty()
        .isIn([
            'suspect',
            'monitored',
            'infected',
            'discarded_by_isolation',
            'discarded_by_test',
            'cured',
            'death'
        ]),

    check('address.address')
        .notEmpty()
        .escape()
        .trim()
        .isLength({ min: 3 }),

]

const store = [
    ...common,

    check('patient.cpf')
        .notEmpty()
        .isNumeric()
        .isLength({ min: 8 })
        .withMessage('Invalid cpf')
        .custom(async (cpf) => {
            const existsPatient = await Patient.verifyIfAlreadExists(cpf);
            const valid = cpf_validator.cpf.isValid(cpf);
            if (existsPatient) throw new Error('Patient already exists')
            return valid;
        }),

    check('patient.password')
        .notEmpty()
        .isLength({ min: 8 })
        .customSanitizer(password => {
            return generateHashedPassword(password)
        }),

	check('fixed_report.recent_travel')
        .notEmpty()
        .isBoolean(),

    check('fixed_report.traveled_to_city')
        .optional()
        .trim()
        .escape(),

    check('fixed_report.recent_contact')
        .notEmpty()
        .isBoolean(),

    check('patient.screening_day')
        .notEmpty()
        .toDate(),
]

const update = common

const login = [
    check('cpf')
        .notEmpty()
        .isNumeric()
        .isLength({ min: 8 })
        .custom((cpf) => {
            const valid = cpf_validator.cpf.isValid(cpf);
            return valid;
        }),

    check('password')
        .notEmpty()
        .isLength({ min: 8 })
        .escape()
        .trim()
]

module.exports = {
    store,
    update,
    login
}
