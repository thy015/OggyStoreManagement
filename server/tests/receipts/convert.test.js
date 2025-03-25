const request = require('supertest');
const express = require('express');
const axios = require('axios');
const receiptRouter = require('../../apis/receipts/receipt.controller');

jest.mock('axios');

const app = express();
app.use(express.json());
app.use('/api/v1/receipts', receiptRouter);

describe('Convert money to VND - POST /api/v1/receipts/converted', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetAllMocks();
    process.env = { ...originalEnv, KEY_MONEY: 'ccd49ecee1-95f31e6675-stns95' };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should return 403 if currency code is missing', async () => {
    const response = await request(app)
      .post('/api/v1/receipts/converted')
      .send({});

    expect(response.status).toBe(403);
    expect(response.body).toEqual({ message: 'Missing currency code' });
  });

  it('should return 403 if API key is missing', async () => {
    delete process.env.KEY_MONEY;

    const response = await request(app)
      .post('/api/v1/receipts/converted')
      .send('USD');

    expect(response.status).toBe(403);
    expect(response.body).toEqual({ message: 'Missing money converting key' });
  });

  it('should return converted value in JSON format when successful - EUR', async () => {
    const mockValue = 27669.11949;
    axios.get.mockResolvedValue({
      data: { results: { VND: mockValue } },
    });

    const response = await request(app)
      .post('/api/v1/receipts/converted')
      .send({ currency_code: 'EUR' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      currency: 'EUR',
      converted_value: mockValue,
    });
  });

  it('should return converted value in JSON format when successful - USD', async () => {
    const mockValue = 25606.73148;
    axios.get.mockResolvedValue({
      data: { results: { VND: mockValue } },
    });

    const response = await request(app)
      .post('/api/v1/receipts/converted')
      .send({ currency_code: 'USD' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      currency: 'USD',
      converted_value: mockValue,
    });
  });

  it('should handle API errors with response', async () => {
    const mockError = {
      response: {
        status: 429,
        data: { message: 'Rate limit exceeded' },
      },
    };
    axios.get.mockRejectedValue(mockError);

    const response = await request(app)
      .post('/api/v1/receipts/converted')
      .send('JYP');

    // Currently your endpoint doesn't return errors to client
    expect(response.status).toBe(403);
    expect(response.body).toEqual({ message: 'Not found currency code' });
    expect(response.body).toEqual({});
  });
});
const mockImageUrl1 =
  'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.britannica.com%2Fanimal%2FSphynx-cat&psig=AOvVaw1dsAyfdkObXpBbP8SBgDaB&ust=1742963576312000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCMjoyrizpIwDFQAAAAAdAAAAABAK';
const mockBase64Data = Buffer.from('test-image-data').toString('base64');
const mockImageBuffer = Buffer.from('test-image-data');

// describe ('Convert image to base 64 (POST /api/v1/receipts/convert-image-to-base64)', () => {
//   const mockBase64Data = Buffer.from ('test-image-data').toString ('base64');

//   beforeEach (() => {
//     jest.clearAllMocks ();
//   });

//   it ('should successfully convert image to base64', async () => {
//     axios.get.mockResolvedValue ({
//       data: mockImageBuffer,
//       headers: {
//         'content-type': 'image/jpeg'
//       }
//     });

//     const response = await request (app).post ('/api/v1/receipts/convert-image-to-base64').send ({imageUri: mockImageUrl1});

//     expect (response.status).toBe (200);
//     expect (response.body).toEqual ({
//       success: true,
//       message: 'Image converted successfully',
//       data: {
//         base64: mockBase64Data,
//         mimeType: 'image/jpeg',
//         sizeBytes: mockImageBuffer.length
//       }
//     });
//     expect (axios.get).toHaveBeenCalledWith (mockImageUrl1, {
//       responseType: 'arraybuffer',
//       timeout: 10000
//     });
//   });

//   it ('should return 403 if imageUri is missing', async () => {
//     const response = await request (app).post ('/api/v1/receipts/convert-image-to-base64').send ({});

//     expect (response.status).toBe (403);
//     expect (response.body).toEqual ({
//       message: 'Missing image uri'
//     });
//   });

//   it ('should return 500 when image fetch fails', async () => {
//     const mockError = new Error ('Network error');
//     axios.get.mockRejectedValue (mockError);

//     const response = await request (app).post ('/api/v1/receipts/convert-image-to-base64').send ({imageUri: mockImageUrl1});

//     expect (response.status).toBe (500);
//     expect (response.body).toEqual ({
//       message: 'Failed to fetch image and convert image'
//     });
//   });

//   it ('should return 400 for invalid URLs', async () => {
//     const response = await request (app).post ('/api/v1/receipts/convert-image-to-base64').send ({imageUri: 'invalid-url'});

//     expect (response.status).toBe (400);
//   });

//   it ('should log the image URI and success message', async () => {
//     axios.get.mockResolvedValue ({
//       data: Buffer.from ('test-image-data')
//     });

//     await request (app).post ('/api/v1/receipts/convert-image-to-base64').send ({imageUri: mockImageUrl1});

//     expect (console.log).toHaveBeenCalledWith (`Fetching image from: ${mockImageUrl1}`);
//     expect (console.log).toHaveBeenCalledWith ('Image fetched successfully!');
//   });
// });
