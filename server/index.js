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
const serviceAccount = require('./serviceAccount.json');
const authenRouter = require('./apis/authens/authen.controller');

// middleware always put first
app.use(bodyParser.json());
app.use(cookieParser());
app.use(morgan('combined'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://lab09-23f9e-default-rtdb.firebaseio.com',
});

//route
app.use('/api/v1/authens/', authenRouter);

const allowedOrigins = ['http://localhost:8081'];

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
// swagger config

app.use(express.static('public'));

// Xử lý lỗi
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Now streaming on http://localhost:${PORT}`);
});
