const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const authRoutes = require('./routes/auth.routes');
const { errorHandler, notFoundHandler } = require('./middleware/error.middleware');

const app = express();

app.use(helmet());
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.get('/health', (req, res) =>
  res.status(200).json({
    success: true,
    service: 'auth-service',
    status: 'OK',
    timestamp: new Date().toISOString(),
  })
);

app.use('/auth', authRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
