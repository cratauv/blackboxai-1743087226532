const express = require('express');
const {
    getListings,
    getListing,
    createListing,
    updateListing,
    deleteListing,
    addReview
} = require('../controllers/listing.controller');

const Listing = require('../models/Listing');

// Include other resource routers
const bookingRouter = require('./booking.routes');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

// Re-route into other resource routers
router.use('/:listingId/bookings', bookingRouter);

router
    .route('/')
    .get(getListings)
    .post(protect, authorize('host', 'admin'), createListing);

router
    .route('/:id')
    .get(getListing)
    .put(protect, authorize('host', 'admin'), updateListing)
    .delete(protect, authorize('host', 'admin'), deleteListing);

router
    .route('/:id/reviews')
    .post(protect, authorize('user'), addReview);

module.exports = router;