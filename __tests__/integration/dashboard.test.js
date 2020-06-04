const app = require('../../src/app');
const request = require('supertest');

describe('Get patients data', () => {
  it('should return patients risk and status data', async () => {
    const response = await request(app)
      .get('/patients/dashboard');

    expect(response.status).toBe(200);
  })
})