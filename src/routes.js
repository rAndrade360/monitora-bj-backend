const routes = require('express').Router();
const ExpressBruteFlexible = require('rate-limiter-flexible/lib/ExpressBruteFlexible');
const redis = require('redis');

const PatientController = require('./app/controllers/PatientController');
const AuthController = require('./app/controllers/AuthController');
const SecretaryController = require('./app/controllers/SecretaryController');
const DashboardController = require('./app/controllers/DashboardController');
const DailyReportController = require('./app/controllers/DailyReportController');
const PatientStatusController = require('./app/controllers/PatientStatusController');

const PatientValidator = require('./app/middlewares/validators/PatientValidator');
const PatientUpdateValidator = require('./app/middlewares/validators/PatientUpdateValidator');
const DailyReportValidator = require('./app/middlewares/validators/DailyReportValidator');
const tokenValidator = require('./app/middlewares/auth/tokenValidator');

const store = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT
});

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

routes.post('/patient/login', bruteforce.prevent ,PatientValidator.login, AuthController.loginPatient);
routes.post('/secretary/login', bruteforce.prevent,SecretaryController.login);
routes.get('/patients/dashboard', bruteforce.prevent, DashboardController.showDataOfAllPatients);

routes.use(tokenValidator);

routes.post('/secretary/password/reset', SecretaryController.resetPassword);

routes.post('/patients', PatientValidator.store, PatientController.create);
routes.get('/patients', PatientController.index);
routes.get('/patient/:id/show', PatientController.show);
routes.put('/patient/:id/update', PatientValidator.update, PatientController.update);
routes.put('/patient/:patientId/status/update', PatientUpdateValidator, PatientStatusController.update);
routes.delete('/patient/:id/delete', PatientController.delete);

routes.post('/patient/dailyreport', DailyReportValidator, DailyReportController.create);
routes.get('/patient/dailyreport', DailyReportController.list);
routes.post('/patient/dailyreport/:reportId/readed', DailyReportController.update);

module.exports = routes;
