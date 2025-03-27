const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Listing = require('../models/Listing');

// @desc    Get all listings
// @route   GET /api/v1/listings
// @access  Public
exports.getListings = asyncHandler(async (req, res, next) => {
    // Copy req.query
    const reqQuery = { ...req.query };

    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit'];
    removeFields.forEach(param => delete reqQuery[param]);

    // Create query string
    let queryStr = JSON.stringify(reqQuery);

    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    // Finding resource
    let query = Listing.find(JSON.parse(queryStr));

    // Select Fields
    if (req.query.select) {
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
    }

    // Sort
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    } else {
        query = query.sort('-createdAt');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Listing.countDocuments(JSON.parse(queryStr));

    query = query.skip(startIndex).limit(limit);

    // Populate
    if (req.query.populate) {
        query = query.populate('host reviews.user');
    }

    // Executing query
    const listings = await query;

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit
        };
    }

    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit
        };
    }

    res.status(200).json({
        success: true,
        count: listings.length,
        pagination,
        data: listings
    });
});

// @desc    Get single listing
// @route   GET /api/v1/listings/:id
// @access  Public
exports.getListing = asyncHandler(async (req, res, next) => {
    const listing = await Listing.findById(req.params.id)
        .populate('host')
        .populate('reviews.user');

    if (!listing) {
        return next(
            new ErrorResponse(`Listing not found with id of ${req.params.id}`, 404)
        );
    }

    res.status(200).json({
        success: true,
        data: listing
    });
});

// @desc    Create new listing
// @route   POST /api/v1/listings
// @access  Private
exports.createListing = asyncHandler(async (req, res, next) => {
    // Add user to req.body
    req.body.host = req.user.id;

    // Check for published listing
    const publishedListing = await Listing.findOne({ host: req.user.id });

    // If the user is not an admin, they can only add one listing
    if (publishedListing && req.user.role !== 'admin') {
        return next(
            new ErrorResponse(
                `The user with ID ${req.user.id} has already published a listing`,
                400
            )
        );
    }

    const listing = await Listing.create(req.body);

    res.status(201).json({
        success: true,
        data: listing
    });
});

// @desc    Update listing
// @route   PUT /api/v1/listings/:id
// @access  Private
exports.updateListing = asyncHandler(async (req, res, next) => {
    let listing = await Listing.findById(req.params.id);

    if (!listing) {
        return next(
            new ErrorResponse(`Listing not found with id of ${req.params.id}`, 404)
        );
    }

    // Make sure user is listing owner
    if (listing.host.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(
            new ErrorResponse(
                `User ${req.user.id} is not authorized to update this listing`,
                401
            )
        );
    }

    listing = await Listing.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: listing
    });
});

// @desc    Delete listing
// @route   DELETE /api/v1/listings/:id
// @access  Private
exports.deleteListing = asyncHandler(async (req, res, next) => {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
        return next(
            new ErrorResponse(`Listing not found with id of ${req.params.id}`, 404)
        );
    }

    // Make sure user is listing owner
    if (listing.host.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(
            new ErrorResponse(
                `User ${req.user.id} is not authorized to delete this listing`,
                401
            )
        );
    }

    await listing.deleteOne();

    res.status(200).json({
        success: true,
        data: {}
    });
});

// @desc    Add review
// @route   POST /api/v1/listings/:id/reviews
// @access  Private
exports.addReview = asyncHandler(async (req, res, next) => {
    req.body.listing = req.params.id;
    req.body.user = req.user.id;

    const listing = await Listing.findById(req.params.id);

    if (!listing) {
        return next(
            new ErrorResponse(`Listing not found with id of ${req.params.id}`, 404)
        );
    }

    // Check if user has already reviewed this listing
    const hasReviewed = listing.reviews.some(
        review => review.user.toString() === req.user.id
    );

    if (hasReviewed) {
        return next(
            new ErrorResponse(`You have already reviewed this listing`, 400)
        );
    }

    listing.reviews.push(req.body);
    listing.calculateAverageRating();

    await listing.save();

    res.status(201).json({
        success: true,
        data: listing
    });
});