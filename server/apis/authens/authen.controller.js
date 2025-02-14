const express = require('express');
const authenRouter = express.Router();
const admin = require('firebase-admin');

authenRouter.post('/sign-in', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Please fill in all fields' });
  }

  try {
    const user = await admin.auth().getUserByEmail(email);
    const auth = admin.auth();
    const userCredential = await auth.signInWithEmailAndPassword(
      email,
      password
    );

    res.status(200).json({ user: userCredential.user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = authenRouter;
