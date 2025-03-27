const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');

// Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
    let token;

    // Get token from Authorization header
    if (req.headers.authorization && 
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }
    // Get token from cookie if not in header
    else if (req.cookies?.token) {
        token = req.cookies.token;
    }

    // Make sure token exists
    if (!token) {
        return next(new ErrorResponse('Not authorized to access this route', 401));
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Add user to req object
        req.user = await User.findById(decoded.id);

        if (!req.user) {
            return next(new ErrorResponse('User not found', 401));
        }

        next();
    } catch (err) {
        return next(new ErrorResponse('Not authorized to access this route', 401));
    }
});

// Grant access to specific roles
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new ErrorResponse(
                    `User role ${req.user.role} is not authorized to access this route`,
                    403
                )
            );
        }
        next();
    };
};

// Check if user owns the resource
exports.checkOwnership = (model) => asyncHandler(async (req, res, next) => {
    const resource = await model.findById(req.params.id);

    if (!resource) {
        return next(
            new ErrorResponse(`Resource not found with id of ${req.params.id}`, 404)
        );
    }

    // Check if user is the owner or is an admin
    if (resource.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(
            new ErrorResponse(`Not authorized to perform this action`, 403)
        );
    }

    next();
});