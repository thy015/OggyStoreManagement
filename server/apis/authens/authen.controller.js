const express = require('express');
const authenRouter = express.Router();
const admin = require('firebase-admin');
const axios = require('axios');

authenRouter.post('/sign-up', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(403).json({ message: 'Missing email or password' });
  }
  // if (!validator.isEmail(email)) {
  //   return res.status(400).json({ message: 'Invalid email format' });
  // }
  // if (password.length < 6) {
  //   return res.status(400).json({ message: 'Password must be at least 6 characters' });
  // }
  try {
    const existingUser = await admin.auth().getUserByEmail(email);
    if (!existingUser) {
      return res.status(400).json({
        message: 'User already exists',
      });
    }
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
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(403).json({ message: 'Missing email or password' });
  }
  try {
    const response = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_API_KEY}`,
      { email, password, returnSecureToken: true }
    );

    // Generate a custom token for client-side Firebase Auth
    const uid = response.data.localId;
    const token = await admin.auth().createCustomToken(uid);

    res.cookie('authToken', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });

    res.status(200).json({ message: 'User signed in successfully' });
  } catch (error) {
    console.error(error);

    const errorCode = error.response?.data?.error?.message;

    if (errorCode) {
      if (errorCode === 'EMAIL_NOT_FOUND' || errorCode === 'INVALID_EMAIL') {
        return res.status(400).json({ error: 'Invalid email address' });
      }

      if (
        errorCode === 'INVALID_PASSWORD' ||
        errorCode === 'MISSING_PASSWORD'
      ) {
        return res.status(400).json({ error: 'Incorrect password' });
      }

      if (errorCode === 'USER_DISABLED') {
        return res.status(403).json({ error: 'Account disabled' });
      }
    }
    // Generic error fallback
    res.status(400).json({ error: 'Authentication failed' });
  }
});

module.exports = authenRouter;
