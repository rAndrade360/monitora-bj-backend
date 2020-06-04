const { check } = require('express-validator');
module.exports = [
  check('risk')
        .notEmpty()
        .isIn(['low', 'medium', 'high', 'critic']),

    check('status')
        .notEmpty()
        .isIn([
            'suspect',
            'monitored',
            'infected',
            'discarded_by_isolation',
            'discarded_by_test',
            'cured',
            'death'
        ])
]
