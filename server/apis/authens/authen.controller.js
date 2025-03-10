const express = require('express');
const authenRouter = express.Router();

authenRouter.get('/get-ai-key', async (req, res) => {
  res.json({ apiKey: process.env.AI_KEY });
});

module.exports = authenRouter;
