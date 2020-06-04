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
        genre: 'female',
        birthday: faker.date.past(),
        screening_day: faker.date.recent(),
        risk: 'medium',
        status: 'monitored',
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

const secretarieData = {
    acess_id: 'aaaaaaaaaa',
    password: generateHash('aaaaaaaa', bcrypt)
}


let token
let patientID
//afterAll(async () => await Patient.deleteAll())
//afterAll(async () => await connection('secretaries').truncate())
beforeAll(async () => {
    const secretaryId = await connection('secretaries').insert(secretarieData)
    token = `Bearer ${generateToken(secretaryId[0], 'secretary')}`
    console.log('secretary user', secretaryId)
})

describe('Patient CRUD tests', () => {

    it('should return 200 if insert patient in database end verify if response is array', async () => {
        const response = await request(app)
            .post('/patients')
            .send(PatientData)
            .set('authorization', token)

        console.log(PatientData)
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        console.log('body', response.body)
	patientID = response.body[0];
    })

    it('should return 200 if select all patients in database and verify if response is array', async () => {
        const response = await request(app)
            .get('/patients')
            .set('authorization', token);

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);

    })

    it('should return 200 if select patient by id is successfull', async () => {
        const response = await request(app)
            .get(`/patient/${patientID}/show`)
            .set('authorization', token);

        console.log(response.body)
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('cpf')
    })

    it('should return 200 if update patient by id is successfull', async () => {
        const response = await request(app)
            .put('/patient/1/update')
            .send(PatientData)
            .set('authorization', token);

        expect(response.status).toBe(200);
        expect(Number.isInteger(response.body)).toBe(true);
    })

    it('should return 200 and true if delete patient by id is successfull', async () => {
        const response = await request(app)
            .delete('/patient/1/delete')
            .set('authorization', token)

        expect(response.status).toBe(200);
        expect(response.body.deleted).toBe(true);
    })
})

describe('patients functions test', () => {
    it('should return true if patient alread exists in database', async () => {
        await request(app)
            .post('/patients')
            .send(PatientData)
            .set('authorization', token)


        const existsPatient = await Patient.verifyIfAlreadExists(PatientData.patient.cpf)
        expect(existsPatient).toBe(true)
    })

})

describe('Patient authentication test', () => {
    it('should return a jwt token if passed cpf and password correctly', async () => {
        const response = await request(app)
            .post('/patient/login')
            .send({
                cpf: PatientData.patient.cpf,
                password: PatientData.patient.password
            })

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('token')
        expect(response.body.type).toBe('Bearer')

    })
})
