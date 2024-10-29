const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/user');
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/task');

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
app.use('/api/task', taskRoutes);

// Default Route
app.get('/', (req, res) => {
    res.send('Welcome to joinlii API');
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ success: false, message: 'Internal server error.' });
});

module.exports = app;
