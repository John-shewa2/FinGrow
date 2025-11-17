// import core dependencies
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// load environment variables
dotenv.config();

// initialize express app
const app = express();

// Get vercel URL for deployment
const corsOptions = {
    origin: process.env.ALLOWED_ORIGIN,
    optionsSuccessStatus: 200
};


// middleware setup
app.use(express.json());
app.use(cors(corsOptions));
// basic test route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// MongoDB connection
const connectDB = require('./config/db');
connectDB();

// define PORT
const PORT = process.env.PORT || 5000;

// start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// user routes
const userRoutes = require('./routes/userRoutes');
const loanRoutes = require('./routes/loanRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

app.use('/api/users', userRoutes.default || userRoutes);
app.use('/api/loans', loanRoutes.default || loanRoutes);
app.use('/api/settings', settingsRoutes.default || settingsRoutes);
app.use('/api/payments', paymentRoutes.default || paymentRoutes);