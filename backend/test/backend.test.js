const fs = require('fs');
const path = require('path');
const request = require('supertest');

// ensure test DB and API key are set before importing app
process.env.DB_PATH = path.join(__dirname, 'test.db');
process.env.API_KEY = 'testkey';

const app = require('../server');

afterAll(() => {
  // clean up test db
  try {
    fs.unlinkSync(process.env.DB_PATH);
  } catch (e) {
    // ignore
  }
});

describe('backend API', () => {
  test('POST /api/logs without API key is unauthorized when API_KEY set', async () => {
    const res = await request(app)
      .post('/api/logs')
      .send({ ip: '198.51.100.9', message: 'test no key' });
    expect(res.status).toBe(401);
  });

  test('POST /api/logs with correct API key returns 201 and stores log', async () => {
    const res = await request(app)
      .post('/api/logs')
      .set('x-api-key', 'testkey')
      .send({ ip: '198.51.100.9', message: 'test with key', level: 'info' });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('inserted');
    expect(res.body.inserted.ip).toBe('198.51.100.9');
  });

  test('GET /api/alerts returns 200', async () => {
    const res = await request(app).get('/api/alerts');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });
});
