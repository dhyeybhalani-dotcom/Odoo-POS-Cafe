const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

// Route Imports
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const customerRoutes = require('./routes/customerRoutes');
const tableRoutes = require('./routes/tableRoutes');
const floorPlanRoutes = require('./routes/floorPlanRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
const settingRoutes = require('./routes/settingRoutes');

// Middleware Imports
const { globalErrorHandler, notFoundHandler } = require('./middleware/errorMiddleware');

const app = express();

// Global Middleware
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Routes Definition
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/tables', tableRoutes);
app.use('/api/floor-plans', floorPlanRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/settings', settingRoutes);

// General Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'API is running optimally.' });
});

// 404 Handler
app.use(notFoundHandler);

// Global Error Handler
app.use(globalErrorHandler);

module.exports = app;
