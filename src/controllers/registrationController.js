import asyncHandler from 'express-async-handler';
import Registration from '../models/Registration.js';
import Competition from '../models/Competition.js';
import ErrorResponse from '../utils/errorResponse.js';

// @desc    Register for a competition
// @route   POST /api/registrations
// @access  Private
export const createRegistration = asyncHandler(async (req, res, next) => {
  const { competition } = req.body;

  // Check if competition exists
  const competitionExists = await Competition.findById(competition);

  if (!competitionExists) {
    return next(new ErrorResponse('Competition not found', 404));
  }

  // Check if already registered
  const existingRegistration = await Registration.findOne({
    user: req.user._id,
    competition,
  });

  if (existingRegistration) {
    return next(
      new ErrorResponse('You are already registered for this competition', 400)
    );
  }

  // Create registration
  const registration = await Registration.create({
    user: req.user._id,
    competition,
  });

  // Increment registrations count
  competitionExists.registrationsCount += 1;
  await competitionExists.save();

  res.status(201).json({
    success: true,
    data: registration,
  });
});

// @desc    Get user's registrations
// @route   GET /api/registrations/my
// @access  Private
export const getMyRegistrations = asyncHandler(async (req, res) => {
  const registrations = await Registration.find({ user: req.user._id })
    .populate({
      path: 'competition',
      populate: {
        path: 'category',
        select: 'name',
      },
    })
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: registrations.length,
    data: registrations,
  });
});

// @desc    Get all registrations (Admin)
// @route   GET /api/registrations
// @access  Private/Admin
export const getAllRegistrations = asyncHandler(async (req, res) => {
  const { competition, status } = req.query;

  let query = {};

  if (competition) {
    query.competition = competition;
  }

  if (status) {
    query.status = status;
  }

  const registrations = await Registration.find(query)
    .populate('user', 'name email')
    .populate({
      path: 'competition',
      populate: {
        path: 'category',
        select: 'name',
      },
    })
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: registrations.length,
    data: registrations,
  });
});

// @desc    Approve registration
// @route   PUT /api/registrations/:id/approve
// @access  Private/Admin
export const approveRegistration = asyncHandler(async (req, res, next) => {
  const registration = await Registration.findById(req.params.id);

  if (!registration) {
    return next(new ErrorResponse('Registration not found', 404));
  }

  if (registration.status === 'approved') {
    return next(new ErrorResponse('Registration already approved', 400));
  }

  registration.status = 'approved';
  await registration.save();

  res.json({
    success: true,
    data: registration,
  });
});

// @desc    Delete registration
// @route   DELETE /api/registrations/:id
// @access  Private
export const deleteRegistration = asyncHandler(async (req, res, next) => {
  const registration = await Registration.findById(req.params.id);

  if (!registration) {
    return next(new ErrorResponse('Registration not found', 404));
  }

  // Check if user owns this registration or is admin
  if (
    registration.user.toString() !== req.user._id.toString() &&
    req.user.role !== 'admin'
  ) {
    return next(
      new ErrorResponse('Not authorized to delete this registration', 403)
    );
  }

  // Decrement registrations count
  const competition = await Competition.findById(registration.competition);
  if (competition && competition.registrationsCount > 0) {
    competition.registrationsCount -= 1;
    await competition.save();
  }

  await registration.deleteOne();

  res.json({
    success: true,
    data: {},
  });
});
