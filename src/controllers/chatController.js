import asyncHandler from 'express-async-handler';
import ChatMessage from '../models/ChatMessage.js';

// @desc    Get chat history between two users
// @route   GET /api/chat/:userId
// @access  Private
export const getChatHistory = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const currentUserId = req.user._id;

  const messages = await ChatMessage.find({
    $or: [
      { sender: currentUserId, receiver: userId },
      { sender: userId, receiver: currentUserId },
    ],
  })
    .populate('sender', 'name email role')
    .populate('receiver', 'name email role')
    .sort({ timestamp: 1 })
    .limit(100);

  res.json({
    success: true,
    count: messages.length,
    data: messages,
  });
});

// @desc    Get all chat conversations
// @route   GET /api/chat/conversations
// @access  Private/Support/Admin
export const getConversations = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Get unique users who have chatted with current user
  const conversations = await ChatMessage.aggregate([
    {
      $match: {
        $or: [{ sender: userId }, { receiver: userId }],
      },
    },
    {
      $sort: { timestamp: -1 },
    },
    {
      $group: {
        _id: {
          $cond: [
            { $eq: ['$sender', userId] },
            '$receiver',
            '$sender',
          ],
        },
        lastMessage: { $first: '$$ROOT' },
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'user',
      },
    },
    {
      $unwind: '$user',
    },
    {
      $project: {
        user: {
          _id: 1,
          name: 1,
          email: 1,
          role: 1,
        },
        lastMessage: {
          message: 1,
          timestamp: 1,
        },
      },
    },
  ]);

  res.json({
    success: true,
    count: conversations.length,
    data: conversations,
  });
});
