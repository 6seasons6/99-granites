const mongoose = require('mongoose');

// MongoDB URI (for local setup, it is usually localhost)
const dbURI = 'mongodb://localhost:27017/99granitesecommerce'; // Replace with your DB name

// Connect to MongoDB
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('Failed to connect to MongoDB', err));
