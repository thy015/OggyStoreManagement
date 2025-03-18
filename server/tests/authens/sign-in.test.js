const request = require('supertest');
const express = require('express');
const admin = require('firebase-admin');
const authenRouter = require('../../apis/authens/authen.controller');

// Mock Firebase Admin SDK
jest.mock('firebase-admin', () => ({
  auth: jest.fn(() => ({
    createUser: jest.fn(),
    getUserByEmail: jest.fn (),
    verifyPassword: jest.fn (),
  })),
}));


// Create an Express app and use the router
const app = express();
app.use(express.json());
app.use('/api/v1/authens', authenRouter);

describe('POST /api/v1/authens/sign-in', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should return 403 if email or password is missing', async () => {
    const response = await request(app)
      .post('/api/v1/authens/sign-in')
      .send({}); // Send empty body

    expect(response.status).toBe(403);
    expect(response.body.message).toBe('Missing email or password');
  });

  it ('should sign in user and return 200 on success', async () => {
    // Define mock user
    const mockUser = {password: '123456', email: 'thymai.1510@gmail.com'};
    admin.auth().createUser.mockResolvedValue(mockUser);

    const response = await request(app).post('/api/v1/authens/sign-in').send({
      email: 'thymai.1510@gmail.com',
      password: '123456',
    });

    expect(response.status).toBe(201);
    expect (response.body.message).toBe ('User signed in successfully');
    expect(response.body.user).toEqual(mockUser);
    expect(admin.auth().createUser).toHaveBeenCalledWith({
      email: 'thymai.1510@gmail.com',
      password: '123456',
    });
  });

  it ('should return 401 if email does not exist', async () => {
    admin.auth ().getUserByEmail.mockRejectedValue (new Error ('User not found'));

    const response = await request (app).post ('/api/v1/authens/sign-in').send ({
      email: 'wrongemail@gmail.com',
      password: '123456',
    });

    expect (response.status).toBe (401);
    expect (response.body.message).toBe ('Invalid email, please try sign up');
  });

  it ('should return 401 if password is incorrect', async () => {
    const mockUser = {email: 'thymai.1510@gmail.com', password: '123456'};
    admin.auth ().getUserByEmail.mockResolvedValue (mockUser);
    admin.auth ().verifyPassword.mockResolvedValue (false); // Wrong password

    const response = await request (app).post ('/api/v1/authens/sign-in').send ({
      email: 'thymai.1510@gmail.com',
      password: 'wrongpassword',
    });

    expect (response.status).toBe (401);
    expect (response.body.message).toBe ('Invalid password');
  });

  it ('should return 400 if email format is invalid', async () => {
    const response = await request (app).post ('/api/v1/authens/sign-in').send ({
      email: 'invalid-email',
      password: '123456',
    });

    expect (response.status).toBe (400);
    expect (response.body.message).toBe ('Invalid email format');
  });

  it('should return 500 if Firebase sign in fails', async () => {
    // Mock a specific Firebase error for existing user
    const mockError = new Error(
      'Please check your connection'
    );
    admin.auth().createUser.mockRejectedValue(mockError);

    const response = await request(app).post('/api/v1/authens/sign-in').send({
      email: 'thymai.1510@gmail.com',
      password: 'password123',
    });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe(
      'Please check your connection'
    );
    expect(response.body.e).toBeDefined();
  });
});
