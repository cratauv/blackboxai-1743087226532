const express = require('express');
const {
    getBookings,
    getBooking,
    createBooking,
    updateBooking,
    cancelBooking
} = require('../controllers/booking.controller');

const router = express.Router({ mergeParams: true });

const { protect, authorize } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

router
    .route('/')
    .get(getBookings)
    .post(authorize('user'), createBooking);

router
    .route('/:id')
    .get(getBooking)
    .put(updateBooking)
    .delete(cancelBooking);

module.exports = router;