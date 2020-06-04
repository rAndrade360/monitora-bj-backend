const app = require('../../src/app');
const request = require('supertest');
const Patient = require('../../src/app/models/Patient');
const faker = require('faker-br');
const bcrypt = require('bcrypt')
const connection = require('../../src/database/connection');
const generateToken = require('../../src/app/controllers/utils/generateToken')
const generateHash = require('../../src/app/utils/generateHashedPassword');

const PatientData = {
    patient: {
        name: faker.name.findName(),
        cpf: faker.br.cpf(),
        phone_number: '+5598992198943',
        genre: 'male',
        birthday: faker.date.past(),
        screening_day: faker.date.recent(),
        risk: 'critic',
        status: 'suspect',
        password: faker.internet.password()
    },
    address: {
        address: faker.address.streetAddress(),
        street: faker.address.streetName(),
        number: 20,
        complement: faker.address.secondaryAddress()
    },
    fixed_report: {
        recent_travel: true,
        traveled_to_city: 'São Paulo',
        recent_contact: true
    }
}

const dailyReportData = {
    fever: true,
    cough: true,
    difficulty_breathing: true,
    sputum_production: true,
    nasal_congestion: true,
    difficulty_swallowing: true,
    sore_throat: true,
    coryza: true,
    signs_of_cyanosis: true,
    drawing: true,
    intercostal: true,
    fatigue: true,
    myalgia_or_arthralgia: true,
    headache: true,
    chill: true,
    red_spots_on_the_body: true,
    enlarged_lymph_nodes: true,
    diarrhea: true,
    nausea: true,
    vomiting: true,
    dehydration: true,
    inappetence: true,
    loss_of_taste: true,
    loss_of_smell: true,
    others: 'Arroz'
}

const secretarieData = {
    acess_id: 'aaaaaaaaaa',
    password: generateHash('aaaaaaaa', bcrypt)
}

let token;



describe('Patient Daily Report Test', () => {

    beforeAll(async () => {
        await Patient.deleteAll();
        const secretaryId = await connection('secretaries').insert(secretarieData)
        console.log('secretary', secretaryId)
        token = `Bearer ${generateToken(secretaryId[0], 'secretary')}`
    })

    it('should return 200 if insert patient in database end verify if response is array', async () => {
        const patientStored = await request(app)
            .post('/patients')
            .send(PatientData)
            .set('authorization', token)

        console.log('patientStored', patientStored.body)

        const loggedPatient = await request(app)
            .post('/patient/login')
            .send({
                cpf: PatientData.patient.cpf,
                password: PatientData.patient.password
            })

        console.log('loggedPatient', loggedPatient.body)

        const response = await request(app)
            .post('/patient/dailyreport')
            .send(dailyReportData)
            .set('authorization', `Bearer ${loggedPatient.body.token}`)


        console.log('Bearer', loggedPatient.body.token)
        console.log('body', response.body)

        expect(response.status).toBe(200);
    })

    it('should return 200 if select daily report today', async () => {
        const response = await request(app)
            .get('/patient/dailyreport')
            .set('authorization', token)


        console.log('daily_report', response.body)
        expect(response.status).toBe(200)
    })

    it('should return 200 if select daily report by date and patient id', async () => {
        const response = await request(app)
            .get('/patient/dailyreport?patient=1')
            .set('authorization', token)


        console.log('daily_report', response.body)
        expect(response.status).toBe(200)
    })
})
