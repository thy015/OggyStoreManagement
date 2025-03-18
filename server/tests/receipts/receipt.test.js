const request = require('supertest');
const app = require('../../index');
const path = require('path');

describe('Scanned image of Vietnamese invoice', () => {
  /** ✅ Test POST /prompts */
  test('should upload image and return response', async () => {
    const filePath = path.join(__dirname, 'tieng_viet.jpg');
    const response = await request(app)
      .post('/api/v1/receipts/upload-and-convert')
      .attach('file', filePath);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('result');
    expect(response.body.result).toBeTruthy();
  }, 60000);

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

  // Test POST /prompts with invalid request body
  test('should return error when no image is uploaded', async () => {
    const response = await request(app)
      .post('/api/v1/receipts/upload-and-convert')
      .attach('file', '');

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('No file uploaded.');
  });
});
