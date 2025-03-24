const request = require('supertest');
const express = require('express');
const admin = require('firebase-admin');
const axios = require ('axios');
const authenRouter = require('../../apis/authens/authen.controller');

// Mock Firebase Admin and Axios
jest.mock('firebase-admin', () => ({
  auth: () => ({
    createCustomToken: jest.fn ().mockResolvedValue ('mock-custom-token'),
  }),
}));
jest.mock ('axios');

const app = express();
app.use(express.json());
app.use('/api/v1/authens', authenRouter);

describe('POST /api/v1/authens/sign-in', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 403 if email or password is missing', async () => {
    const response = await request(app).post ('/api/v1/authens/sign-in').send ({}); // Send empty body

    expect(response.status).toBe(403);
    expect(response.body.message).toBe('Missing email or password');
  });

  it ('should sign in user and return 200 on success', async () => {
    // Mock Firebase REST API response
    axios.post.mockResolvedValue ({
      data: {
        localId: 'user123',
        idToken: 'mock-token'
      },
    });

    // Mock Firebase Admin token generation
    admin.auth ().createCustomToken.mockResolvedValue ('custom-token');

    const response = await request (app).post ('/api/v1/authens/sign-in').send ({
      email: 'thymai.1510@gmail.com',
      password: '123456'
    });

    expect (response.status).toBe (200);
    expect (response.body.message).toBe ('User signed in successfully');
    expect (response.headers['set-cookie']).toBeDefined (); // Check for cookie
  });

  it ('should return 400 for invalid email', async () => {
    axios.post.mockRejectedValue ({
      response: {
        data: {
          error: {
            message: 'EMAIL_NOT_FOUND'
          }
        }
      },
    });

    const response = await request (app).post ('/api/v1/authens/sign-in').send ({
      email: 'nonexistent@example.com',
      password: 'any-password'
    });

    expect (response.status).toBe (400);
    expect (response.body.error).toBe ('Invalid email address');
  });

  it ('should return 400 for incorrect password', async () => {
    axios.post.mockRejectedValue ({
      response: {
        data: {
          error: {
            message: 'INVALID_PASSWORD'
          }
        }
      },
    });

    const response = await request (app).post ('/api/v1/authens/sign-in').send ({
      email: 'valid@example.com',
      password: 'wrong-password'
    });

    expect (response.status).toBe (400);
    expect (response.body.error).toBe ('Incorrect password');
  });
});