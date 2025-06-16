require('dotenv').config({ path: '../.env' }); // تأكد من المسار الصحيح لملف .env
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const userRoutes = require('./routes/userRoutes');
const entryRoutes = require('./routes/entryRoutes');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// Middleware
app.use(cors()); // السماح لـ CORS من أي مصدر (للتطوير)
app.use(express.json()); // تحليل طلبات JSON

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully!'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/entries', entryRoutes);

// Simple root route
app.get('/', (req, res) => {
  res.send('Backend API is running!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});