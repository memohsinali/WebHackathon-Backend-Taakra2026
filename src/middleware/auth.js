import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import { verifyAccessToken } from '../utils/generateToken.js';
import ErrorResponse from '../utils/errorResponse.js';

// Protect routes - verify JWT token
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }

  const decoded = verifyAccessToken(token);

  if (!decoded) {
    return next(new ErrorResponse('Not authorized, token failed', 401));
  }

  const user = await User.findById(decoded.id);

  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  req.user = user;
  next();
});

// Authorize specific roles
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User role '${req.user.role}' is not authorized to access this route`,
          403
        )
      );
    }
    next();
  };
};
