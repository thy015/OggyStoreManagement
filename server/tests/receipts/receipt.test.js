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

  /** ✅ Test POST /prompts */
  test('should upload image and return response', async () => {
    const filePath = path.join(__dirname, 'tieng_thai.jpg');
    const response = await request(app)
      .post('/api/v1/receipts/upload-and-convert')
      .attach('file', filePath);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('result');
    expect(response.body.result).toBeTruthy();
  }, 60000);

  test('should return error when no image is uploaded', async () => {
    const response = await request(app)
      .post('/api/v1/receipts/upload-and-convert')
      .attach('file', '');

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('No file uploaded.');
  });

  test('should return 200 and valid JSON response', async () => {
    const response = await request(app)
      .post('/api/v1/receipts/text-convert')
      .send({ text: 'Ăn sáng 30k' });

    expect(response.statusCode).toBe(200);
    expect(response.body).toBeDefined();
    expect(typeof response.body).toBe('object');
  });

  test('should return 403 for missing text field', async () => {
    const response = await request(app)
      .post('/api/v1/receipts/text-convert')
      .send({});

    expect(response.statusCode).toBe(403);
    expect(response.body.message).toBe('Missing or invalid request body');
  });

  test('should return 403 for invalid text type', async () => {
    const response = await request(app)
      .post('/api/v1/receipts/text-convert')
      .send({ text: 12345 });

    expect(response.statusCode).toBe(403);
    expect(response.body.message).toBe('Missing or invalid request body');
  });
});
