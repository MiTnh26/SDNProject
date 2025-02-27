// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const employeeRoutes = require('../routes/employees');

const app = express();
const PORT = process.env.PORT; 
const MONGO_URI = process.env.MONGO_URI;

app.use(express.json()); // Middleware để parse JSON
app.use('/employees', employeeRoutes); // Đường dẫn tới router

// Kết nối MongoDB
mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Khởi chạy server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
