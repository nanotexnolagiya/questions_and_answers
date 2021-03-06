const express = require('express');
const { json, urlencoded } = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const routes = require('./routes');
const ResponseException = require('./utils/response-exception');

global.ResponseException = ResponseException;

const app = express();

app.use(urlencoded({ extended: true }));
app.use(json());
app.use(morgan('dev'));
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/v1', routes.api);

app.use('/api/v1', (req, res, next) => {
  const error = new ResponseException('Страница не найдена', 404);
  next(error);
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    ok: false,
    message: error.message
  });
});

// app.get('/*', (req, res, next) => {
//   res.sendFile(path.join(__dirname, 'client/index.html'));
// })

module.exports = app;
