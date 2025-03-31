const express = require('express');
const { getBookings, getBooking, createBooking, updateBooking, cancelBooking } = require('../controllers/booking.controller');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/').get(protect, getBookings);
router.route('/:id').get(protect, getBooking).put(protect, updateBooking).delete(protect, cancelBooking);
router.route('/listings/:listingId/bookings').post(protect, createBooking);

module.exports = router;