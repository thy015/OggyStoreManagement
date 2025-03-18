const request = require('supertest');
const app = require('../../index');
const path = require('path');

describe('Chat bot', () => {
  // Test POST
  test('should return 200 and valid JSON response', async () => {
    const response = await request(app)
      .post('/api/v1/receipts/text-convert')
      .send({ text: 'Ăn sáng 30k' });

    expect(response.statusCode).toBe(200);
    expect(response.body).toBeDefined();
    expect(typeof response.body).toBe('object');
  });

  //  Test POST /prompts with invalid request body
  test('should return 402 for missing text field', async () => {
    const response = await request(app)
      .post('/api/v1/receipts/text-convert')
      .send({});

    expect(response.statusCode).toBe(403);
    expect(response.body.message).toBe('Missing or invalid request body');
  });

  test('should return 403 for invalid text field', async () => {
    const response = await request(app)
      .post('/api/v1/receipts/text-convert')
      .send({ text: 'a12345' });

    expect(response.statusCode).toBe(403);
    expect(response.body.message).toBe('underfine');
  });

  test('should return 403 for invalid text field', async () => {
    const response = await request(app)
      .post('/api/v1/receipts/text-convert')
      .send({ text: 'abcd' });

    expect(response.statusCode).toBe(403);
    expect(response.body.message).toBe('underfine');
  });
});
