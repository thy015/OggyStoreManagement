const request = require('supertest');
const express = require('express');
const admin = require('firebase-admin');
const authenRouter = require('../../apis/authens/authen.controller');

// Mock Firebase Admin SDK
jest.mock('firebase-admin', () => ({
  auth: jest.fn(() => ({
    createUser: jest.fn(),
  })),
}));

// Create an Express app and use the router
const app = express();
app.use(express.json());
app.use('/api/v1/authens', authenRouter);

describe('POST /api/v1/authens/sign-up', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should return 403 if email or password is missing', async () => {
    const response = await request(app)
      .post('/api/v1/authens/sign-up')
      .send({}); // Send empty body

    expect(response.status).toBe(403);
    expect(response.body.message).toBe('Missing email or password');
  });

  it('should create a user and return 201 on success', async () => {
    // Define mock user
    const mockUser = {password: 'password123', email: 'test5@example.com'};
    admin.auth().createUser.mockResolvedValue(mockUser);

    const response = await request(app).post('/api/v1/authens/sign-up').send({
      email: 'test5@example.com',
      password: 'password123',
    });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('User created successfully');
    expect(response.body.user).toEqual(mockUser);
    expect(admin.auth().createUser).toHaveBeenCalledWith({
      email: 'test5@example.com',
      password: 'password123',
    });
  });

  it('should return 500 if Firebase createUser fails because the user already exists', async () => {
    // Mock a specific Firebase error for existing user
    const mockError = new Error(
      'The email address is already in use by another account.'
    );
    admin.auth().createUser.mockRejectedValue(mockError);

    const response = await request(app).post('/api/v1/authens/sign-up').send({
      email: 'test1@example.com',
      password: 'password123',
    });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe(
      'The email address is already in use by another account.'
    );
    expect(response.body.e).toBeDefined();
  });
});
