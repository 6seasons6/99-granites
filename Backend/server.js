const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/99-granites', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// Create a schema and model
const billingSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const Billing = mongoose.model('Billing', billingSchema);

// POST endpoint to handle form submission
app.post('/submit-billing', async (req, res) => {
    const { name, email, message, street, city, state, zipCode } = req.body;

    // Create a new billing entry with the updated fields
    const newBilling = new Billing({
        name,
        email,
        message,
        street,
        city,
        state,
        zipCode
    });

    try {
        await newBilling.save();
        res.status(201).json({ message: 'Billing information saved successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Error saving billing information', error });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
