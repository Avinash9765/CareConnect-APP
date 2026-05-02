const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({ origin: [process.env.FRONTEND_URL || 'http://localhost:3000', 'http://localhost:3001'], credentials: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/donations', require('./routes/foodDonation'));
app.use('/api/events', require('./routes/event'));
app.use('/api/sponsorship', require('./routes/sponsorship'));
app.use('/api/impact', require('./routes/impact'));

// Health Check
app.get('/api/health', (req, res) => res.json({ status: 'ok', message: 'CareConnect API running' }));

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).json({ 
        success: false, 
        message: err.message || 'Server error' 
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
