const request = require('supertest');
const app = require('../../index');
const path = require('path');

describe('Receipt API Tests', () => {
  /** ✅ Test GET /get-vision-key */
  test('should return visionKey', async () => {
    const response = await request(app).get('/api/v1/receipts/get-vision-key');

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('visionKey');
    expect(typeof response.body.visionKey).toBe('string');
    expect(response.body.visionKey).toBeTruthy();
  });

  /** ✅ Test GET /get-ai-key */
  test('should return aiKey', async () => {
    const response = await request(app).get('/api/v1/receipts/get-ai-key');

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('apiKey');
    expect(typeof response.body.apiKey).toBe('string');
    expect(response.body.apiKey).toBeTruthy();
  });
});
