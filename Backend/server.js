const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');  // Add dotenv to load environment variables

// Load environment variables from .env file
dotenv.config();

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/99-granites', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("Connected to MongoDB");

  // Insert a test document
  const testSchema = new mongoose.Schema({ name: String });
  const TestModel = mongoose.model('Test', testSchema);

  const testData = new TestModel({ name: "Test Document" });
  testData.save().then(() => console.log("Document inserted"));
}).catch(err => console.error("Error connecting to MongoDB", err));

// Example of using the SECRET_KEY from the .env file
const secretKey = process.env.SECRET_KEY;  // Access the secret key

// You can log the secret key for debugging (only do this in a secure environment)
console.log("SECRET_KEY:", secretKey);

// Other routes and server setup
app.get('/', (req, res) => {
  res.send('Hello World');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
