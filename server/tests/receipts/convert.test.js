const request = require ('supertest');
const express = require ('express');
const axios = require ('axios');
const receiptRouter = require ("../../apis/receipts/receipt.controller");

jest.mock ('axios');

const app = express ();
app.use (express.json ());
app.use ('/api/v1/receipts', receiptRouter);

describe ('POST /api/v1/receipts/converted', () => {
  const originalEnv = process.env;

  beforeEach (() => {
    jest.resetAllMocks ();
    process.env = {...originalEnv, KEY_MONEY: 'ccd49ecee1-95f31e6675-stns95'};
  });

  afterAll (() => {
    process.env = originalEnv;
  });

  it ('should return 403 if currency code is missing', async () => {
    const response = await request (app).post ('/api/v1/receipts/converted').send ({});

    expect (response.status).toBe (403);
    expect (response.body).toEqual ({message: 'Missing currency code'});
  });

  it ('should return 403 if API key is missing', async () => {
    delete process.env.KEY_MONEY;

    const response = await request (app).post ('/api/v1/receipts/converted').send ('USD');

    expect (response.status).toBe (403);
    expect (response.body).toEqual ({message: 'Missing money converting key'});
  });

  it ('should call external API with correct parameters', async () => {
    axios.get.mockResolvedValue ({
      data: {results: {VND: 25000}}
    });

    await request (app).post ('/api/v1/receipts/converted').send ('EUR');

    expect (axios.get).toHaveBeenCalledWith (
      'https://api.fastforex.io/fetch-multi?from=EUR&to=VND&api_key=test-api-key'
    );
  });

  it ('should return VND conversion value when successful', async () => {
    const mockValue = 25000;
    axios.get.mockResolvedValue ({
      data: {results: {VND: mockValue}}
    });

    const response = await request (app).post ('/api/v1/receipts/converted').send ('USD');

    // Note: Your endpoint returns raw value instead of JSON response
    expect (response.body).toBe (mockValue);
  });

  it ('should handle API errors with response', async () => {
    const mockError = {
      response: {
        status: 429,
        data: {message: 'Rate limit exceeded'}
      }
    };
    axios.get.mockRejectedValue (mockError);

    const response = await request (app).post ('/api/v1/receipts/converted').send ('JYP');

    // Currently your endpoint doesn't return errors to client
    expect (response.status).toBe (500);
    expect (response.body).toEqual ({message: 'Not found currency code'});
    expect (response.body).toEqual ({});
  });

});