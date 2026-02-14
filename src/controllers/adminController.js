import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import Competition from '../models/Competition.js';
import Registration from '../models/Registration.js';
import ErrorResponse from '../utils/errorResponse.js';

// @desc    Get admin statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getStats = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalCompetitions = await Competition.countDocuments();
  const totalRegistrations = await Registration.countDocuments();

  // Get registrations by competition
  const registrationsByCompetition = await Registration.aggregate([
    {
      $group: {
        _id: '$competition',
        count: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: 'competitions',
        localField: '_id',
        foreignField: '_id',
        as: 'competition',
      },
    },
    {
      $unwind: '$competition',
    },
    {
      $project: {
        count: 1,
        competition: {
          title: '$competition.title',
        },
      },
    },
    {
      $sort: { count: -1 },
    },
    {
      $limit: 10,
    },
  ]);

  res.json({
    success: true,
    data: {
      totalUsers,
      totalCompetitions,
      totalRegistrations,
      registrationsByCompetition,
    },
  });
});

// @desc    Add support member
// @route   POST /api/admin/support
// @access  Private/Admin
export const addSupportMember = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  if (user.role === 'support') {
    return next(new ErrorResponse('User is already a support member', 400));
  }

  user.role = 'support';
  await user.save();

  res.json({
    success: true,
    data: user,
  });
});

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });

  res.json({
    success: true,
    count: users.length,
    data: users,
  });
});
