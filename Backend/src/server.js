// import core dependencies
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// load environment variables
dotenv.config();

// initialize express app
const app = express();

// middleware setup
app.use(express.json());
app.use(cors());

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

// routes
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);