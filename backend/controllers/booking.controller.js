const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Booking = require('../models/Booking');
const Listing = require('../models/Listing');

// @desc    Get all bookings
// @route   GET /api/v1/bookings
// @route   GET /api/v1/listings/:listingId/bookings
// @access  Private
exports.getBookings = asyncHandler(async (req, res, next) => {
    let query;

    if (req.params.listingId) {
        // Get bookings for a specific listing
        query = Booking.find({ listing: req.params.listingId });
    } else {
        // Get all bookings for the logged-in user
        query = Booking.find({ user: req.user.id });
    }

    // Add population
    query = query
        .populate({
            path: 'listing',
            select: 'title images location price'
        })
        .populate({
            path: 'user',
            select: 'name email'
        });

    const bookings = await query;

    res.status(200).json({
        success: true,
        count: bookings.length,
        data: bookings
    });
});

// @desc    Get single booking
// @route   GET /api/v1/bookings/:id
// @access  Private
exports.getBooking = asyncHandler(async (req, res, next) => {
    const booking = await Booking.findById(req.params.id)
        .populate({
            path: 'listing',
            select: 'title images location price'
        })
        .populate({
            path: 'user',
            select: 'name email'
        });

    if (!booking) {
        return next(
            new ErrorResponse(`Booking not found with id of ${req.params.id}`, 404)
        );
    }

    // Make sure user is booking owner or listing host
    if (
        booking.user.toString() !== req.user.id &&
        booking.listing.host.toString() !== req.user.id &&
        req.user.role !== 'admin'
    ) {
        return next(
            new ErrorResponse(`Not authorized to access this booking`, 401)
        );
    }

    res.status(200).json({
        success: true,
        data: booking
    });
});

// @desc    Create booking
// @route   POST /api/v1/listings/:listingId/bookings
// @access  Private
exports.createBooking = asyncHandler(async (req, res, next) => {
    req.body.listing = req.params.listingId;
    req.body.user = req.user.id;

    const listing = await Listing.findById(req.params.listingId);

    if (!listing) {
        return next(
            new ErrorResponse(
                `Listing not found with id of ${req.params.listingId}`,
                404
            )
        );
    }

    // Check if listing is available for the requested dates
    const isAvailable = await checkListingAvailability(
        req.params.listingId,
        req.body.checkIn,
        req.body.checkOut
    );

    if (!isAvailable) {
        return next(
            new ErrorResponse(
                `Listing is not available for the selected dates`,
                400
            )
        );
    }

    // Create booking
    const booking = await Booking.create(req.body);

    // Calculate total price
    await booking.calculateTotalPrice();
    await booking.save();

    res.status(201).json({
        success: true,
        data: booking
    });
});

// @desc    Update booking
// @route   PUT /api/v1/bookings/:id
// @access  Private
exports.updateBooking = asyncHandler(async (req, res, next) => {
    let booking = await Booking.findById(req.params.id);

    if (!booking) {
        return next(
            new ErrorResponse(`Booking not found with id of ${req.params.id}`, 404)
        );
    }

    // Make sure user is booking owner
    if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(
            new ErrorResponse(`Not authorized to update this booking`, 401)
        );
    }

    // If dates are being updated, check availability
    if (req.body.checkIn || req.body.checkOut) {
        const isAvailable = await checkListingAvailability(
            booking.listing,
            req.body.checkIn || booking.checkIn,
            req.body.checkOut || booking.checkOut,
            booking._id
        );

        if (!isAvailable) {
            return next(
                new ErrorResponse(
                    `Listing is not available for the selected dates`,
                    400
                )
            );
        }
    }

    booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    // Recalculate total price if dates or number of guests changed
    if (req.body.checkIn || req.body.checkOut || req.body.numberOfGuests) {
        await booking.calculateTotalPrice();
        await booking.save();
    }

    res.status(200).json({
        success: true,
        data: booking
    });
});

// @desc    Cancel booking
// @route   DELETE /api/v1/bookings/:id
// @access  Private
exports.cancelBooking = asyncHandler(async (req, res, next) => {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
        return next(
            new ErrorResponse(`Booking not found with id of ${req.params.id}`, 404)
        );
    }

    // Make sure user is booking owner
    if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(
            new ErrorResponse(`Not authorized to cancel this booking`, 401)
        );
    }

    // Update booking status to cancelled
    booking.status = 'cancelled';
    await booking.save();

    res.status(200).json({
        success: true,
        data: booking
    });
});

// Helper function to check listing availability
const checkListingAvailability = async (
    listingId,
    checkIn,
    checkOut,
    excludeBookingId = null
) => {
    const query = {
        listing: listingId,
        status: { $in: ['pending', 'confirmed'] },
        $or: [
            {
                checkIn: { $lte: new Date(checkOut) },
                checkOut: { $gte: new Date(checkIn) }
            }
        ]
    };

    // Exclude current booking if updating
    if (excludeBookingId) {
        query._id = { $ne: excludeBookingId };
    }

    const existingBooking = await Booking.findOne(query);

    return !existingBooking;
};