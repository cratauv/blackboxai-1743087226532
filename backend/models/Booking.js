const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    listing: {
        type: mongoose.Schema.ObjectId,
        ref: 'Listing',
        required: true
    },
    checkIn: {
        type: Date,
        required: [true, 'Please add a check-in date']
    },
    checkOut: {
        type: Date,
        required: [true, 'Please add a check-out date']
    },
    numberOfGuests: {
        type: Number,
        required: [true, 'Please specify number of guests']
    },
    totalPrice: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled', 'completed'],
        default: 'pending'
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'refunded'],
        default: 'pending'
    },
    specialRequests: {
        type: String,
        maxlength: [500, 'Special requests cannot be more than 500 characters']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Validate check-in and check-out dates
bookingSchema.pre('save', function(next) {
    // Check if dates are in the future
    if (this.checkIn < Date.now()) {
        throw new Error('Check-in date must be in the future');
    }
    if (this.checkOut < Date.now()) {
        throw new Error('Check-out date must be in the future');
    }
    
    // Check if check-out is after check-in
    if (this.checkOut <= this.checkIn) {
        throw new Error('Check-out date must be after check-in date');
    }

    next();
});

// Method to calculate number of nights
bookingSchema.methods.calculateNights = function() {
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    return Math.round(Math.abs((this.checkOut - this.checkIn) / oneDay));
};

// Method to calculate total price
bookingSchema.methods.calculateTotalPrice = async function() {
    const listing = await mongoose.model('Listing').findById(this.listing);
    if (!listing) {
        throw new Error('Listing not found');
    }
    
    const nights = this.calculateNights();
    this.totalPrice = nights * listing.price;
};

// Index for efficient querying
bookingSchema.index({ user: 1, listing: 1, checkIn: 1, checkOut: 1 });

// Compound index to prevent double bookings
bookingSchema.index(
    { 
        listing: 1, 
        checkIn: 1, 
        checkOut: 1,
        status: 1 
    },
    { 
        unique: true,
        partialFilterExpression: { 
            status: { $in: ['pending', 'confirmed'] } 
        }
    }
);

module.exports = mongoose.model('Booking', bookingSchema);