const routes = require('express').Router();
const Brute = require('express-brute');
const BruteRedis = require('express-brute-redis');

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

const store = new BruteRedis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT
});

const bruteforce = new Brute(store);

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
