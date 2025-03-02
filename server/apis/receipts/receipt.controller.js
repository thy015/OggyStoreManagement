const express = require('express');
const axios = require('axios');
const receiptRouter = express.Router();

/** GET */
receiptRouter.get('', async (req, res) => {});

/** POST */
receiptRouter.post('/prompts', async (req, res) => {
  const requestBody = req.body;

  if (!requestBody) {
    return res.status(403).json({ message: 'Missing request body' });
  }

  try {
    const promptData = await axios.post(
      `https://speech.googleapis.com/v1/speech:recognize?key=${process.env.GOOGLE_VISION_API_KEY}`,
      requestBody,
      { headers: { 'Content-Type': 'application/json' } }
    );

    return res
      .status(200)
      .json({ message: 'Transfer success', data: promptData.data });
  } catch (e) {
    console.error('❌ API Error:', e.message);

    if (e.response) {
      return res.status(e.response.status).json({
        message: 'API request failed',
        error: e.response.data,
      });
    }

    return res.status(500).json({
      message: 'Internal server error',
      error: e.message,
    });
  }
});

receiptRouter.post('/image-convert', async (req, res) => {
  const requestBody = req.body;
  if (!requestBody) {
    return res.status(403).json({ message: 'Missing request body' });
  }
  try {
    const imageConvert = await axios.post(
      `https://vision.googleapis.com/v1/images:annotate?key=${process.env.GOOGLE_VISION_API_KEY}`,
      requestBody
    );
    return res.status(200).json({ message: 'Transfer success', imageConvert });
  } catch (e) {
    return res.status(500).json({ message: 'Internal server error' });
  }
});
module.exports = receiptRouter;
