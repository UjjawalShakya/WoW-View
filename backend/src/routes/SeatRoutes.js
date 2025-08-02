const express = require('express');
// const { getSeatRecommendation } = require('../controllers/SeatController');
const SeatController = require('../controllers/SeatController');
const router = express.Router();

// router.get('/recommend', getSeatRecommendation);
router.get('/recommend', SeatController.getSeatRecommendation);
module.exports = router;