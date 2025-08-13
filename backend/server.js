const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');
const emailService = require('./services/emailService');

const app = express();
connectDB();

// Trust proxy for IP tracking
app.set('trust proxy', true);

app.use(cors());
app.use(express.json({ limit: '10mb' })); // Increased limit for base64 images
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/api', require('./routes/index'));

// Global error handler
app.use((err, req, res, next) => {
    console.error('Global error:', err.message);
    res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`API endpoints available at http://localhost:${PORT}/api`);
    
    // Test email service connection
    console.log('\n📧 Testing email service connection...');
    await emailService.testConnection();
});
