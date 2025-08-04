require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const designRoutes = require('./routes/designRoutes');
const categoryRoutes = require('./routes/categoryRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection with better timeout settings
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,  // Timeout after 5s instead of 30s
  socketTimeoutMS: 45000          // Close sockets after 45s of inactivity
})
.then(() => console.log('Connected to MongoDB Atlas'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/designs', designRoutes);
app.use('/categories', categoryRoutes);

// Health check endpoint (for external ping services)
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK',
    dbStatus: mongoose.connection.readyState 
  });
});

// Basic route
app.get('/', (req, res) => {
  res.send('Interior Design API is running');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});