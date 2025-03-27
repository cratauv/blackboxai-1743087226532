const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
    host: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true,
        maxlength: [100, 'Title cannot be more than 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
        maxlength: [2000, 'Description cannot be more than 2000 characters']
    },
    images: [{
        type: String,
        required: [true, 'Please add at least one image']
    }],
    price: {
        type: Number,
        required: [true, 'Please add a price per night']
    },
    location: {
        address: {
            type: String,
            required: [true, 'Please add an address']
        },
        city: {
            type: String,
            required: [true, 'Please add a city']
        },
        state: {
            type: String,
            required: [true, 'Please add a state']
        },
        country: {
            type: String,
            required: [true, 'Please add a country']
        },
        zipCode: {
            type: String,
            required: [true, 'Please add a zip code']
        },
        coordinates: {
            lat: Number,
            lng: Number
        }
    },
    amenities: [{
        type: String,
        enum: [
            'Wifi',
            'Kitchen',
            'Free parking',
            'Air conditioning',
            'Heating',
            'Washer',
            'Dryer',
            'TV',
            'Pool',
            'Hot tub',
            'Gym',
            'Elevator',
            'Wheelchair accessible',
            'Smoke alarm',
            'Carbon monoxide alarm'
        ]
    }],
    propertyType: {
        type: String,
        required: [true, 'Please specify property type'],
        enum: [
            'Entire house',
            'Entire apartment',
            'Private room',
            'Shared room',
            'Unique space'
        ]
    },
    bedrooms: {
        type: Number,
        required: [true, 'Please specify number of bedrooms']
    },
    beds: {
        type: Number,
        required: [true, 'Please specify number of beds']
    },
    bathrooms: {
        type: Number,
        required: [true, 'Please specify number of bathrooms']
    },
    maxGuests: {
        type: Number,
        required: [true, 'Please specify maximum number of guests']
    },
    rating: {
        type: Number,
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating cannot be more than 5']
    },
    reviews: [{
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: true
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        comment: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    houseRules: {
        checkIn: {
            type: String,
            default: '15:00'
        },
        checkOut: {
            type: String,
            default: '11:00'
        },
        smokingAllowed: {
            type: Boolean,
            default: false
        },
        petsAllowed: {
            type: Boolean,
            default: false
        },
        partiesAllowed: {
            type: Boolean,
            default: false
        }
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'pending'],
        default: 'active'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Add index for location-based searches
listingSchema.index({ 'location.city': 'text', 'location.state': 'text', 'location.country': 'text' });

// Calculate average rating when a review is added
listingSchema.methods.calculateAverageRating = function() {
    if (this.reviews.length === 0) {
        this.rating = 0;
        return;
    }
    
    const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
    this.rating = Math.round((sum / this.reviews.length) * 10) / 10;
};

module.exports = mongoose.model('Listing', listingSchema);