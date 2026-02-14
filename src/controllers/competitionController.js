import asyncHandler from 'express-async-handler';
import Competition from '../models/Competition.js';
import ErrorResponse from '../utils/errorResponse.js';

// @desc    Get all competitions with filters and sorting
// @route   GET /api/competitions
// @access  Public
export const getCompetitions = asyncHandler(async (req, res) => {
  const { category, search, sort, startDate, endDate } = req.query;

  // Build query
  let query = {};

  // Filter by category
  if (category) {
    query.category = category;
  }

  // Search by title
  if (search) {
    query.title = { $regex: search, $options: 'i' };
  }

  // Filter by date range
  if (startDate || endDate) {
    query.startDate = {};
    if (startDate) {
      query.startDate.$gte = new Date(startDate);
    }
    if (endDate) {
      query.startDate.$lte = new Date(endDate);
    }
  }

  // Build sort
  let sortOption = {};
  switch (sort) {
    case 'most-registrations':
      sortOption = { registrationsCount: -1 };
      break;
    case 'trending':
      // Trending = recent registrations (competitions with recent activity)
      sortOption = { updatedAt: -1 };
      break;
    case 'new':
      sortOption = { createdAt: -1 };
      break;
    default:
      sortOption = { startDate: 1 };
  }

  const competitions = await Competition.find(query)
    .populate('category', 'name')
    .sort(sortOption);

  res.json({
    success: true,
    count: competitions.length,
    data: competitions,
  });
});

// @desc    Get single competition
// @route   GET /api/competitions/:id
// @access  Public
export const getCompetition = asyncHandler(async (req, res, next) => {
  const competition = await Competition.findById(req.params.id).populate(
    'category',
    'name description'
  );

  if (!competition) {
    return next(new ErrorResponse('Competition not found', 404));
  }

  res.json({
    success: true,
    data: competition,
  });
});

// @desc    Get competitions in calendar format
// @route   GET /api/competitions/calendar
// @access  Public
export const getCompetitionsCalendar = asyncHandler(async (req, res) => {
  const competitions = await Competition.find()
    .select('title startDate endDate venue dayNumber')
    .populate('category', 'name')
    .sort({ startDate: 1 });

  res.json({
    success: true,
    count: competitions.length,
    data: competitions,
  });
});

// @desc    Create competition
// @route   POST /api/competitions
// @access  Private/Admin
export const createCompetition = asyncHandler(async (req, res) => {
  const competition = await Competition.create(req.body);

  res.status(201).json({
    success: true,
    data: competition,
  });
});

// @desc    Update competition
// @route   PUT /api/competitions/:id
// @access  Private/Admin
export const updateCompetition = asyncHandler(async (req, res, next) => {
  let competition = await Competition.findById(req.params.id);

  if (!competition) {
    return next(new ErrorResponse('Competition not found', 404));
  }

  competition = await Competition.findByIdAndUpdate(req.params.id, req.body, {
    returnDocument: 'after',
    runValidators: true,
  });

  res.json({
    success: true,
    data: competition,
  });
});

// @desc    Delete competition
// @route   DELETE /api/competitions/:id
// @access  Private/Admin
export const deleteCompetition = asyncHandler(async (req, res, next) => {
  const competition = await Competition.findById(req.params.id);

  if (!competition) {
    return next(new ErrorResponse('Competition not found', 404));
  }

  await competition.deleteOne();

  res.json({
    success: true,
    data: {},
  });
});
