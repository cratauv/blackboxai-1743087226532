const express = require('express');
const { getListings, getListing, createListing, updateListing, deleteListing, addReview } = require('../controllers/listing.controller');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/').get(getListings).post(protect, createListing);
router.route('/:id').get(getListing).put(protect, updateListing).delete(protect, deleteListing);
router.route('/:id/reviews').post(protect, addReview);

module.exports = router;