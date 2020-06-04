const { check } = require('express-validator');
module.exports = [
    check('fever')
        .notEmpty()
        .isBoolean(),

    check('cough')
        .notEmpty()
        .isBoolean(),

    check('difficulty_breathing')
        .notEmpty()
        .isBoolean(),

    check('sputum_production')
        .notEmpty()
        .isBoolean(),

    check('nasal_congestion')
        .notEmpty()
        .isBoolean(),

    check('difficulty_swallowing')
        .notEmpty()
        .isBoolean(),

    check('sore_throat')
        .notEmpty()
        .isBoolean(),

    check('coryza')
        .notEmpty()
        .isBoolean(),

    check('signs_of_cyanosis')
        .notEmpty()
        .isBoolean(),

    check('drawing')
        .notEmpty()
        .isBoolean(),

    check('intercostal')
        .notEmpty()
        .isBoolean(),

    check('fatigue')
        .notEmpty()
        .isBoolean(),

    check('myalgia_or_arthralgia')
        .notEmpty()
        .isBoolean(),

    check('headache')
        .notEmpty()
        .isBoolean(),

    check('chill')
        .notEmpty()
        .isBoolean(),

    check('red_spots_on_the_body')
        .notEmpty()
        .isBoolean(),

    check('enlarged_lymph_nodes')
        .notEmpty()
        .isBoolean(),

    check('diarrhea')
        .notEmpty()
        .isBoolean(),

    check('nausea')
        .notEmpty()
        .isBoolean(),

    check('vomiting')
        .notEmpty()
        .isBoolean(),

    check('dehydration')
        .notEmpty()
        .isBoolean(),

    check('inappetence')
        .notEmpty()
        .isBoolean(),

    check('loss_of_taste')
        .notEmpty()
        .isBoolean(),

    check('loss_of_smell')
        .notEmpty()
        .isBoolean(),

    check('others')
        .optional()
        .trim()
        .escape(),
]
