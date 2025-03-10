const express = require('express');
const authenRouter = express.Router();
const admin = require ('firebase-admin')

authenRouter.post ('/sign-up', async (req, res) => {
  const {email, password} = req.body
  if (!email || !password) {
    return res.status (403).json ({message: "Missing email or password"})
  }
  try {
    const user = await admin.auth ().createUser ({
      email,
      password
    })
    return res.status (201).json ({message: 'User created successfully', user})
  } catch (e) {
    return res.status (500).json ({message: e.message, e})
  }
});

module.exports = authenRouter;