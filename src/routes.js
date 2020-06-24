const routes = require('express').Router();
const ExpressBruteFlexible = require('rate-limiter-flexible/lib/ExpressBruteFlexible');
const redis = require('redis');

const PatientController = require('./app/controllers/PatientController');
const AuthController = require('./app/controllers/AuthController');
const SecretaryController = require('./app/controllers/SecretaryController');
const DashboardController = require('./app/controllers/DashboardController');
const DailyReportController = require('./app/controllers/DailyReportController');
const PatientStatusController = require('./app/controllers/PatientStatusController');
const TestDataController = require('./app/controllers/TestDataController');
const StrategyController = require('./app/controllers/StrategyController');

const PatientValidator = require('./app/middlewares/validators/PatientValidator');
const PatientUpdateValidator = require('./app/middlewares/validators/PatientUpdateValidator');
const DailyReportValidator = require('./app/middlewares/validators/DailyReportValidator');
const TestDataValidator = require('./app/middlewares/validators/TestDataValidator');
const StrategyValidator = require('./app/middlewares/validators/StrategyValidator');
const tokenValidator = require('./app/middlewares/auth/tokenValidator');

let store;
if (process.env.NODE_ENV === 'production') {
  store = redis.createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
  });
} else {
  store = redis.createClient({
    host: 'localhost',
    port: 6379,
  });
}

const opts = {
  freeRetries: 5,
  minWait: 1000, // 1 second
  maxWait: 30000, // 10 seconds
  lifetime: 60, // 30 seconds
  storeClient: store,
};

const bruteforce = new ExpressBruteFlexible(
  ExpressBruteFlexible.LIMITER_TYPES.REDIS,
  opts
);

const allowCrossDomain = (req, res, next) => {
  res.header('Access-Control-Expose-Headers', 'X-Total-Count');
  next();
}

routes.post(
  '/patient/login',
  bruteforce.prevent,
  PatientValidator.login,
  AuthController.loginPatient
);

routes.post(
  '/secretary/login',
  bruteforce.prevent,
  StrategyValidator.login,
  AuthController.loginStrategy,
  SecretaryController.login
);

routes.use(tokenValidator);

routes.get(
  '/patients/dashboard',
  bruteforce.prevent,
  DashboardController.showDataOfAllPatients
);

routes.post('/secretary/password/reset', SecretaryController.resetPassword);

routes.post('/patients', PatientValidator.store, PatientController.create);
routes.get('/patients', allowCrossDomain, PatientController.index);
routes.get('/patient/:id/show', PatientController.show);
routes.put(
  '/patient/:id/update',
  PatientValidator.update,
  PatientController.update
);
routes.put(
  '/patient/:patientId/status/update',
  PatientUpdateValidator,
  PatientStatusController.update
);
routes.delete('/patient/:id/delete', PatientController.delete);

routes.post('/strategies', StrategyValidator.store, StrategyController.create);
routes.get('/strategies', StrategyController.index);

routes.post(
  '/patient/dailyreport',
  DailyReportValidator,
  DailyReportController.create
);
routes.get('/patient/dailyreport', DailyReportController.list);
routes.post(
  '/patient/dailyreport/:reportId/readed',
  DailyReportController.update
);

routes.put(
  '/patient/:patientId/test/:testId',
  TestDataValidator,
  TestDataController.update
);
routes.get('/patient/test', TestDataController.index);

module.exports = routes;
