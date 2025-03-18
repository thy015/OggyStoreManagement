const express = require('express');
const authenRouter = express.Router();
const admin = require('firebase-admin');

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
  const token = req.headers.authorization?.split('Bearer ')[1];

  if (!token) {
    return res.status(403).json({ message: 'Missing token' });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const user = await admin.auth().getUser(decodedToken.uid);
    return res
      .status(200)
      .json({ message: 'User signed in successfully', user });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
});

module.exports = authenRouter;
