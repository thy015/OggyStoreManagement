const request = require('supertest');

describe ('Scanned image of Vietnamese invoice (Public API)', () => {
  const baseURL = 'https://oggy-store-management-be.vercel.app/api/v1/receipts';

  beforeEach (() => {
    jest.resetModules ();
  });

  // Restore mocks after each test
  afterEach (() => {
    jest.restoreAllMocks ();
  });

  /** ✅ Test uploading a Vietnamese invoice image */
  test('should upload image and return response', async () => {
    const response = await request (baseURL).post ('/upload-and-convert').attach ('file', `${__dirname}/tieng_viet.jpg`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('result');
    expect(response.body.result).toBeTruthy();
  }, 60000);

  /** ✅ Test uploading a Thai invoice image */
  test('should upload image and return response', async () => {
    const response = await request (baseURL).post ('/upload-and-convert').attach ('file', `${__dirname}/tieng_thai.jpg`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('result');
    expect(response.body.result).toBeTruthy();
  }, 60000);

  /** ❌ Test error when no image is uploaded */
  test('should return error when no image is uploaded', async () => {
    const response = await request (baseURL).post ('/upload-and-convert');

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('No file uploaded.');
  });

  /** ❌ Test invalid file format (PDF) */
  test ('should return error for invalid file format (PDF)', async () => {
    const filePath = path.join (__dirname, 'invalid_file.pdf');
    const response = await request (baseURL).post ('/upload-and-convert').attach ('file', filePath);

    expect (response.statusCode).toBe (400);
    expect (response.body).toHaveProperty ('message');
    expect (response.body.message).toMatch (/Invalid file format/);
  });

  /** ❌ Test invalid file format (TXT) */
  test ('should return error for invalid file format (TXT)', async () => {
    const filePath = path.join (__dirname, 'invalid_file.txt');
    const response = await request (baseURL).post ('/upload-and-convert').attach ('file', filePath);

    expect (response.statusCode).toBe (400);
    expect (response.body).toHaveProperty ('message');
    expect (response.body.message).toMatch (/Invalid file format/);
  });

  /** ❌ Test API key is missing */
  test ('should return error when API key is missing', async () => {
    process.env.GOOGLE_VISION_API_KEY = ''; // Temporarily remove API key
    const filePath = path.join (__dirname, 'tieng_viet.jpg');
    const response = await request (baseURL).post ('/upload-and-convert').attach ('file', filePath);

    expect (response.statusCode).toBe (500);
    expect (response.body).toHaveProperty ('message');
    expect (response.body.message).toMatch (/Must supply API key/);
  });

  /** ❌ Test API key is incorrect */
  test ('should return error when API key is incorrect', async () => {
    process.env.GOOGLE_VISION_API_KEY = 'INVALID_API_KEY';
    const filePath = path.join (__dirname, 'tieng_viet.jpg');
    const response = await request (baseURL).post ('/upload-and-convert').attach ('file', filePath);

    expect (response.statusCode).toBe (500);
    expect (response.body).toHaveProperty ('message');
    expect (response.body.message).toMatch (/API key is invalid/);
  });

  /** ❌ Test malformed request body */
  test ('should return error for malformed request', async () => {
    const response = await request (baseURL).post ('/upload-and-convert').send ({fakeParam: 'fakeValue'});

    expect (response.statusCode).toBe (400);
    expect (response.body).toHaveProperty ('message');
    expect (response.body.message).toMatch (/Invalid request payload/);
  });
});
