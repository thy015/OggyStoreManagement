const PORT = process.env.PORT || 8082;
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
dotenv.config();
const app = express();
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const http = require('http');
const admin = require('firebase-admin');
const authenRouter = require('./apis/authens/authen.controller');
const receiptRouter = require('./apis/receipts/receipt.controller');
// middleware always put first
app.use (express.json ());
app.use (bodyParser.json ());
app.use (cookieParser ());
app.use (morgan ('combined'));

const allowedOrigins = [
  'http://localhost:8081',
  'https://oggy-store-management-be.vercel.app',
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }
      if (
        allowedOrigins.some((allowedOrigin) => origin.startsWith(allowedOrigin))
      ) {
        return callback(null, true);
      }
      console.error('Blocked by CORS:', origin);
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

//service account config
const serviceAccountBase64 = process.env.SERVICE_ACCOUNT_BASE64;
const serviceAccount = JSON.parse(
  Buffer.from(serviceAccountBase64, 'base64').toString('utf8')
);
if (!serviceAccountBase64) {
  console.error('❌ SERVICE_ACCOUNT_BASE64 is missing!');
  throw new Error('Missing SERVICE_ACCOUNT_BASE64 environment variable');
}
console.log('✅ Firebase service account loaded.');

//initialize firebase admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://lab09-23f9e-default-rtdb.firebaseio.com',
});

//route
app.use(
  '/api/v1/authens',
  authenRouter
);

app.use(
  '/api/v1/receipts',
  receiptRouter
);

// 🔥 Add CORS headers manually in case middleware fails
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:8081');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

app.get('/', (req, res) => res.send('Express on Vercel'));

// 🔥 Add CORS headers manually in case middleware fails
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:8081');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

// Xử lý lỗi
app.use((err, req, res, next) => {
  console.log (err);
  res.status(500).send('Something broke!');
  next ();
});

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Now streaming on http://localhost:${PORT}`);
});

module.exports = app