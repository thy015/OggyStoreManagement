const express = require('express');
const axios = require('axios');
const receiptRouter = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.AI_KEY);
const uploadCloud = require('../../config/cloudinary.config');

/** GET */
// key validation
receiptRouter.get('/get-vision-key', async (req, res) => {
  try {
    if (!process.env.GOOGLE_VISION_API_KEY) {
      return res.status (503).json ({
        success: false,
        message: 'Google Vision API key not configured',
        error: 'Service unavailable'
      });
    }
    return res.status (200).json ({
      success: true,
      visionKey: process.env.GOOGLE_VISION_API_KEY
    });
  } catch (error) {
    console.error ('Error getting vision key:', error);
    return res.status (500).json ({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});
receiptRouter.get ('/get-money-key', async (req, res) => {
  try {
    if (!process.env.KEY_MONEY) {
      return res.status (503).json ({
        success: false,
        message: 'Google Vision API key not configured',
        error: 'Service unavailable'
      });
    }
    return res.status (200).json ({
      success: true,
      moneyKey: process.env.KEY_MONEY
    });
  } catch (error) {
    console.error ('Error getting vision key:', error);
    return res.status (500).json ({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});
receiptRouter.get('/get-ai-key', async (req, res) => {
  try {
    if (!process.env.AI_KEY) {
      return res.status (503).json ({
        success: false,
        message: 'AI API key not configured',
        error: 'Service unavailable'
      });
    }

    if (process.env.AI_KEY.length < 32) {
      return res.status (500).json ({
        success: false,
        message: 'Invalid AI key configuration',
        error: 'Malformed API key'
      });
    }

    return res.status (200).json ({
      success: true,
      apiKey: process.env.AI_KEY
    });
  } catch (error) {
    console.error ('Error getting AI key:', error);
    return res.status (500).json ({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

/** POST */
receiptRouter.post('/prompts', async (req, res) => {
  console.log('🔹 Received request body:', JSON.stringify(req.body, null, 2));

  if (!req.body) {
    return res.status(403).json({ message: 'Missing request body' });
  }

  try {
    const promptData = await axios.post(
      `https://speech.googleapis.com/v1/speech:recognize?key=${process.env.GOOGLE_VISION_API_KEY}`,
      req.body,
      { headers: { 'Content-Type': 'application/json' } }
    );

    return res
      .status(200)
      .json({ message: 'Transfer success', promptData: promptData.data });
  } catch (e) {
    console.error('❌ API Error:', e.message, e.response?.data);

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

receiptRouter.post ('/converted', async (req, res) => {
  const {currency_code} = req.body;

  if (!currency_code) {
    return res.status (403).json ({message: 'Missing currency code'});
  }
  if (!process.env.KEY_MONEY) {
    return res.status (403).json ({message: 'Missing money converting key'});
  }

  console.log ('🔹 Received request for currency:', currency_code);

  try {
    const response = await axios.get(
      `https://api.fastforex.io/fetch-multi?from=${currency_code}&to=VND&api_key=${process.env.KEY_MONEY}`
    );

    if (
      !response.data ||
      !response.data.results ||
      !response.data.results.VND
    ) {
      return res.status (500).json ({message: 'Invalid response from currency API'});
    }

    const vndValue = response.data.results.VND;
    return res.json ({currency: currency_code, converted_value: vndValue});
  } catch (error) {
    console.log ('Error converting money:', error.message);
    return res.status (500).json ({message: 'Error converting currency', error: error.message});
  }
});

function isValidUrl (string) {
  try {
    new URL (string);
    return true;
  } catch (_) {
    return false;
  }
}
receiptRouter.post ('/convert-image-to-base64', async (req, res) => {
  const {imageUri} = req.body
  if (!imageUri) {
    return res.status (403).json ({message: 'Missing image uri'});
  }
  if (!isValidUrl (imageUri)) {
    return res.status (400).json ({
      success: false,
      message: 'Invalid image URL format',
      error: 'Validation error'
    });
  }
  try {
    console.log(`Fetching image from: ${imageUri}`);
    const response = await axios.get (imageUri, {
      responseType: 'arraybuffer',
      timeout: 10000 // 10 second timeout
    });

    if (!response.data || response.data.length === 0) {
      return res.status (400).json ({
        success: false,
        message: 'Received empty image data',
        error: 'Invalid image'
      });
    }

    console.log('Image fetched successfully!');
    const base64Data = Buffer.from (response.data).toString ('base64');

    return res.status (200).json ({
      success: true,
      message: 'Image converted successfully',
      data: {
        base64: base64Data,
        mimeType: response.headers['content-type'] || 'application/octet-stream',
        sizeBytes: response.data.length
      }
    });
  } catch (error) {
    console.error ('Error fetching image:', error.message);

    let statusCode = 500;
    let errorMessage = 'Failed to fetch and convert image';

    if (error.response) {
      // Handle HTTP errors from the image server
      statusCode = error.response.status;
      errorMessage = `Image server responded with ${statusCode}`;
    } else if (error.code === 'ECONNABORTED') {
      statusCode = 504;
      errorMessage = 'Image server request timeout';
    }

    return res.status (statusCode).json ({
      success: false,
      message: errorMessage,
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
})


const generateTextImage = async (text) => {
  console.log('🔥 Text:', text);
  try {
    const prompt = `
      Chuyển đổi đoạn văn bản sau thành định dạng JSON của hóa đơn thanh toán.
      ghi là 'json {....}'
      ${text} Đảm bảo JSON chỉ bao gồm các trường:  'items' (mỗi item có 'productName', 'quantity', 'price'),    'totalAmount', 'Date','category','currency_code' currency_code là mã tiền tệ của nước đó .
      Đảm bảo có phân loại "category" thể loại giao dịch ví dụ như ( đồ ăn , vui chơi , mua sắm, sinh hoạt ,...)
      Bạn chỉ cần viết ra mỗi json không cần giải thích thêm.
    `;

    const model = genAI?.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const response = await model?.generateContent([prompt]);

    let result =
      response?.response.candidates?.[0]?.content?.parts?.[0]?.text || '';
    result = result.replace(/```json|```/g, '').trim();
    const json = JSON.parse(result);
    return json;
  } catch (error) {
    console.log ('Error generating text:', error);
  }
};
const SUPPORTED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/jpg',
];
//API conver image to text
receiptRouter.post(
  '/upload-and-convert',
  uploadCloud.single('file'),
  async (req, res) => {
    console.log ('🔹 Received request body:', req.file);

    // Validate file exists
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    // Validate file type
    if (!SUPPORTED_MIME_TYPES.includes (req.file.mimetype)) {
      return res.status (400).json ({message: 'Invalid file format'});
    }

    // Validate API key
    if (
      !process.env.GOOGLE_VISION_API_KEY ||
      process.env.GOOGLE_VISION_API_KEY.trim () === ''
    ) {
      console.log ('API Key validation failed - key is missing or empty');
      return res.status (500).json ({
        message: 'Must supply API key',
        details: 'GOOGLE_VISION_API_KEY is missing or empty',
      });
    }

    try {
      const imageUrl = req.file.path;
      const base64Image = await axios.post ('api/v1/receipts/convert-image-to-base64', imageUrl);

      const imageConvert = await axios.post(
        `https://vision.googleapis.com/v1/images:annotate?key=${process.env.GOOGLE_VISION_API_KEY}`,
        {
          requests: [
            {
              image: { content: base64Image },
              features: [{ type: 'TEXT_DETECTION' }],
            },
          ],
        }
      );

      // Handle API errors
      if (imageConvert.data.error) {
        if (imageConvert.data.error.message.includes ('API key')) {
          return res.status (500).json ({message: 'API key is invalid'});
        }
        throw new Error (imageConvert.data.error.message);
      }

      const extractedText =
        imageConvert.data.responses[0]?.textAnnotations?.[0]?.description || '';

      let result = await generateTextImage(extractedText);

      // Currency conversion if needed
      if (result.currency_code !== 'VND') {
        const conversionRate = await axios.post (
          `/api/v1/receipts/converted`,
          result.currency_code
        );
        result.totalAmount *= conversionRate;
        result.items = await Promise.all(
          result.items.map(async (item) => {
            item.price *= conversionRate;
            return item;
          })
        );
      }

      return res.status(200).json({ result });
    } catch (error) {
      console.log ('🔥 Error:', error);

      // Handle specific errors
      if (error.response) {
        if (error.response.status === 400) {
          return res.status (400).json ({message: 'Invalid request payload'});
        }
        if (error.response.data?.error?.message.includes ('API key')) {
          return res.status (500).json ({message: 'API key is invalid'});
        }
      }

      return res.status (500).json ({
        message: 'Internal server error',
        error:
          process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }
);

const generateTextChat = async (text) => {
  console.log('🔥 Text:', text);
  try {
    const prompt = `
      Chuyển đổi đoạn văn bản sau thành định dạng JSON.
      ${text} 
      Đảm bảo JSON chỉ bao gồm các trường:
       - 'items' (mỗi item có 'productName', 'quantity', 'price'),
       - 'totalAmount',
       - 'category',
       - 'type'.
      Nếu 'price' là giá tiền nước khác thì đổi thành định dạng số tiền VND.
      Type có thể là: "thu nhập" hoặc "chi tiêu".
      Phân loại "category" thể loại giao dịch ví dụ như (đồ ăn, vui chơi, mua sắm, sinh hoạt,...).
      Nếu không xác định được type, để type: "undefined".
      Chỉ xuất JSON, không kèm theo bất kỳ văn bản nào khác.
    `;

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const response = await model.generateContent([prompt]);

    let result =
      response.response.candidates?.[0]?.content?.parts?.[0]?.text || '';

    console.log('🔥 Raw AI Response:', result);

    // Loại bỏ các ký tự không cần thiết như ```json
    result = result.replace(/```json|```/g, '').trim();

    const json = JSON.parse(result);
    console.log('🔥 Dữ liệu JSON:', json);
    return json;
  } catch (error) {
    console.log ('Error generating text:', error);
    return null;
  }
};

//API convert audio to text
receiptRouter.post('/text-convert', async (req, res) => {
  const { text } = req.body;
  if (!text || typeof text !== 'string') {
    return res.status(403).json({ message: 'Missing or invalid request body' });
  }
  try {
    const json = await generateTextChat(text);
    if (json) {
      return res.status(200).json(json);
    } else {
      return res.status(500).json({ message: 'Failed to generate JSON' });
    }
  } catch (e) {
    console.log ('Error in /text-convert:', e);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = receiptRouter;
