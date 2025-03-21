const express = require('express');
const axios = require('axios');
const receiptRouter = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.AI_KEY);
const uploadCloud = require('../../config/cloudinary.config');

/** GET */
receiptRouter.get('/get-vision-key', async (req, res) => {
  return res.status(200).json({ visionKey: process.env.GOOGLE_VISION_API_KEY });
});
receiptRouter.get('/get-ai-key', async (req, res) => {
  res.json({ apiKey: process.env.AI_KEY });
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

const MoneyConverted = async (currency_code) => {
  try {
    const response = await axios.get(
      `https://api.fastforex.io/fetch-multi?from=${currency_code}&to=VND&api_key=${process.env.KEY_MONNEY}`
    );

    const vndValue = response.data.results.VND;
    return vndValue;
  } catch (error) {
    console.error('Error converting money:', error);
  }
};

const convertImageToBase64 = async (imageUri) => {
  try {
    console.log(`Fetching image from: ${imageUri}`);
    const response = await axios.get(imageUri, { responseType: 'arraybuffer' });

    console.log('Image fetched successfully!');
    return Buffer.from(response.data).toString('base64');
  } catch (error) {
    console.error('Error fetching image:', error.message);
    throw new Error('Failed to fetch image');
  }
};

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
    console.error('Error generating text:', error);
  }
};

//API conver image to text
receiptRouter.post(
  '/upload-and-convert',
  uploadCloud.single('file'),
  async (req, res) => {
    console.log('🔹 Received request body:' + req.file);
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    try {
      const imageUrl = req.file.path;

      const base64Image = await convertImageToBase64(imageUrl);

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

      const extractedText =
        imageConvert.data.responses[0]?.textAnnotations?.[0]?.description || '';
      let result = await generateTextImage(extractedText);
      if (result.currency_code !== 'VND') {
        result.totalAmount *= await MoneyConverted(result.currency_code);

        result.items = await Promise.all(
          result.items.map(async (item) => {
            item.price *= await MoneyConverted(result.currency_code);
            return item;
          })
        );
      }
      return res.status(200).json({ result });
    } catch (error) {
      console.error('🔥 Error:', error);
      return res.status(500).json({ message: 'Internal server error', error });
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
    console.error('Error generating text:', error);
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
    console.error('Error in /text-convert:', e);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = receiptRouter;
