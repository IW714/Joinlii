const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/user');
const authRoutes = require('./routes/auth');

// Middleware
const app = express();
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
  }));
app.use(express.json());

// Routes
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);

module.exports = app;
