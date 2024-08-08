const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'Public' directory
app.use(express.static(path.join(__dirname, 'Public')));

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/dogcare')
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('Failed to connect to MongoDB', err);
    });

// Define a Mongoose schema and model for the adopt form data
const adoptSchema = new mongoose.Schema({
    name: String,
    address: String,
    breed: String,
    email: String
});
const Adopt = mongoose.model('Adopt', adoptSchema);

// Define a Mongoose schema and model for reviews
const reviewSchema = new mongoose.Schema({
    name: String,
    review: String,
    rating: Number // Add a rating field
});
const Review = mongoose.model('Review', reviewSchema);

// Route to handle form submission for adoption
app.post('/adopt', async (req, res) => {
    try {
        console.log('Form data received:', req.body);
        const adoptData = new Adopt(req.body);
        await adoptData.save();
        res.redirect('/success.html');
    } catch (err) {
        console.error('Error saving adoption request:', err);
        res.status(500).send('Error submitting form');
    }
});

// Route to handle review form submission
app.post('/add-review', async (req, res) => {
    try {
        console.log('Review data received:', req.body);
        const reviewData = new Review(req.body);
        await reviewData.save();
        res.status(200).send('Review added successfully');
    } catch (err) {
        console.error('Error saving review:', err);
        res.status(500).send('Error submitting review');
    }
});

// Route to fetch reviews
app.get('/get-reviews', async (req, res) => {
    try {
        const reviews = await Review.find();
        res.json(reviews);
    } catch (err) {
        console.error('Error fetching reviews:', err);
        res.status(500).send('Error fetching reviews');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
