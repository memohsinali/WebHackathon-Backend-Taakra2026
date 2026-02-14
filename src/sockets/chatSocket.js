import ChatMessage from '../models/ChatMessage.js';
import User from '../models/User.js';
import { verifyAccessToken } from '../utils/generateToken.js';
import logger from '../config/logger.js';

// Store connected users
const connectedUsers = new Map();

export const initializeChatSocket = (io) => {
  io.on('connection', (socket) => {
    logger.info(`Socket connected: ${socket.id}`);

    // Authenticate socket connection
    socket.on('authenticate', async (token) => {
      try {
        const decoded = verifyAccessToken(token);

        if (!decoded) {
          socket.emit('error', { message: 'Invalid token' });
          socket.disconnect();
          return;
        }

        const user = await User.findById(decoded.id);

        if (!user) {
          socket.emit('error', { message: 'User not found' });
          socket.disconnect();
          return;
        }

        // Store user connection
        socket.userId = user._id.toString();
        connectedUsers.set(socket.userId, socket.id);

        socket.emit('authenticated', {
          userId: user._id,
          name: user.name,
          role: user.role,
        });

        logger.info(`User authenticated: ${user.name} (${user._id})`);
      } catch (error) {
        logger.error('Socket authentication error:', error);
        socket.emit('error', { message: 'Authentication failed' });
        socket.disconnect();
      }
    });

    // Handle sending messages
    socket.on('sendMessage', async (data) => {
      try {
        const { receiverId, message } = data;

        if (!socket.userId) {
          socket.emit('error', { message: 'Not authenticated' });
          return;
        }

        // Validate receiver
        const receiver = await User.findById(receiverId);

        if (!receiver) {
          socket.emit('error', { message: 'Receiver not found' });
          return;
        }

        // Save message to database
        const chatMessage = await ChatMessage.create({
          sender: socket.userId,
          receiver: receiverId,
          message,
        });

        // Populate sender and receiver info
        await chatMessage.populate('sender', 'name email role');
        await chatMessage.populate('receiver', 'name email role');

        // Send to receiver if online
        const receiverSocketId = connectedUsers.get(receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('receiveMessage', chatMessage);
        }

        // Send confirmation to sender
        socket.emit('messageSent', chatMessage);

        logger.info(`Message sent from ${socket.userId} to ${receiverId}`);
      } catch (error) {
        logger.error('Send message error:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Handle typing indicator
    socket.on('typing', (data) => {
      const { receiverId } = data;
      const receiverSocketId = connectedUsers.get(receiverId);

      if (receiverSocketId && socket.userId) {
        io.to(receiverSocketId).emit('userTyping', {
          userId: socket.userId,
        });
      }
    });

    // Handle stop typing
    socket.on('stopTyping', (data) => {
      const { receiverId } = data;
      const receiverSocketId = connectedUsers.get(receiverId);

      if (receiverSocketId && socket.userId) {
        io.to(receiverSocketId).emit('userStopTyping', {
          userId: socket.userId,
        });
      }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      if (socket.userId) {
        connectedUsers.delete(socket.userId);
        logger.info(`User disconnected: ${socket.userId}`);
      }
      logger.info(`Socket disconnected: ${socket.id}`);
    });
  });
};

export default initializeChatSocket;
