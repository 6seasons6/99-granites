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

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

const User = mongoose.model('User ', userSchema);

// POST endpoint to handle signup
app.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;

    const existingUser  = await User.findOne({ email });
    if (existingUser ) {
        return res.status(400).json({ message: 'User  already signed up with this email.' });
    }

    const newUser  = new User({
        name,
        email,
        password,
    });

    try {
        await newUser.save();
        res.status(201).json({ message: 'User  registered successfully!' });
    } catch (error) {
        console.error('Error saving user:', error);
        res.status(500).json({ message: 'Error saving user', error });
    }
});

app.post('/signin', async (req, res) => {
    const { email, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: 'No account found with this email. Please sign up.' });
    }

    // Check if the password matches
    if (user.password !== password) {
        return res.status(400).json({ message: 'Incorrect password. Please try again.' });
    }

    res.status(200).json({ message: 'Sign in successful!' });
});

// POST endpoint to handle password reset
app.post('/reset-password', async (req, res) => {
    const { email, newPassword } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: 'No account found with this email. Please sign up.' });
    }

    // Update the user's password
    user.password = newPassword; // You may want to hash the password before saving
    try {
        await user.save();
        res.status(200).json({ message: 'Password has been reset successfully!' });
    } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).json({ message: 'Error updating password', error });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
