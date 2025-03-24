const express = require('express');
const authenRouter = express.Router();
const admin = require('firebase-admin');
const axios = require ('axios');

authenRouter.post('/sign-up', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(403).json({ message: 'Missing email or password' });
  }
  try {
    const user = await admin.auth().createUser({
      email,
      password,
    });
    return res.status(201).json({ message: 'User created successfully', user });
  } catch (e) {
    return res.status(500).json({ message: e.message, e });
  }
});

authenRouter.post('/sign-in', async (req, res) => {
  const {email, password} = req.body;

  try {
    const response = await axios.post (
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_API_KEY}`,
      {email, password, returnSecureToken: true}
    );

    // Generate a custom token for client-side Firebase Auth
    const uid = response.data.localId;
    const token = await admin.auth ().createCustomToken (uid);

    res.cookie ('authToken', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });

    res.status (200).json ({message: 'User signed in successfully'});

  } catch (error) {
    console.error (error);

    // Firebase REST API error response structure
    const errorCode = error.response?.data?.error?.message;

    if (errorCode) {
      // Email-related errors
      if (
        errorCode === 'EMAIL_NOT_FOUND' ||
        errorCode === 'INVALID_EMAIL'
      ) {
        return res.status (400).json ({error: 'Invalid email address'});
      }

      // Password-related errors
      if (
        errorCode === 'INVALID_PASSWORD' ||
        errorCode === 'MISSING_PASSWORD'
      ) {
        return res.status (400).json ({error: 'Incorrect password'});
      }

      // Account-related errors (e.g., disabled)
      if (errorCode === 'USER_DISABLED') {
        return res.status (403).json ({error: 'Account disabled'});
      }
    }

    // Generic error fallback
    res.status (400).json ({error: 'Authentication failed'});
  }
});

module.exports = authenRouter;
