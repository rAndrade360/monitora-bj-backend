const { check } = require('express-validator');
module.exports = [
    check('daily_report.fever')
        .notEmpty()
        .isBoolean(),

    check('daily_report.cough')
        .notEmpty()
        .isBoolean(),

    check('daily_report.difficulty_breathing')
        .notEmpty()
        .isBoolean(),

    check('daily_report.sputum_production')
        .notEmpty()
        .isBoolean(),

    check('daily_report.nasal_congestion')
        .notEmpty()
        .isBoolean(),

    check('daily_report.difficulty_swallowing')
        .notEmpty()
        .isBoolean(),

    check('daily_report.sore_throat')
        .notEmpty()
        .isBoolean(),

    check('daily_report.coryza')
        .notEmpty()
        .isBoolean(),

    check('daily_report.signs_of_cyanosis')
        .notEmpty()
        .isBoolean(),

    check('daily_report.drawing')
        .notEmpty()
        .isBoolean(),

    check('daily_report.intercostal')
        .notEmpty()
        .isBoolean(),

    check('daily_report.fatigue')
        .notEmpty()
        .isBoolean(),

    check('daily_report.myalgia_or_arthralgia')
        .notEmpty()
        .isBoolean(),

    check('daily_report.headache')
        .notEmpty()
        .isBoolean(),

    check('daily_report.chill')
        .notEmpty()
        .isBoolean(),

    check('daily_report.red_spots_on_the_body')
        .notEmpty()
        .isBoolean(),

    check('daily_report.enlarged_lymph_nodes')
        .notEmpty()
        .isBoolean(),

    check('daily_report.diarrhea')
        .notEmpty()
        .isBoolean(),

    check('daily_report.nausea')
        .notEmpty()
        .isBoolean(),

    check('daily_report.vomiting')
        .notEmpty()
        .isBoolean(),

    check('daily_report.dehydration')
        .notEmpty()
        .isBoolean(),

    check('daily_report.inappetence')
        .notEmpty()
        .isBoolean(),

    check('daily_report.loss_of_taste')
        .notEmpty()
        .isBoolean(),

    check('daily_report.loss_of_smell')
        .notEmpty()
        .isBoolean(),

    check('daily_report.others')
        .optional()
        .trim()
        .escape(),
]
