require('dotenv').config(); // Load environment variables
const express = require('express');
const seatRoutes = require('./src/routes/SeatRoutes');
const cors = require('cors'); // Import CORS

const app = express();
const port = 3000;

// Enable CORS for all routes
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// Use the seat recommendation routes for any requests to /api
app.use('/api', seatRoutes);

app.listen(port, () => {
    console.log(`✈️ Seat Recommender API listening on http://localhost:${port}`);
});