const express = require('express');
const authenRouter = express.Router();
const admin = require('firebase-admin');

authenRouter.get('/user', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(403).json({ error: 'Please provide an email' });
  }
  try {
    const auth = admin.auth();
    const user = await auth.getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    console.log(user);
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
module.exports = authenRouter;
