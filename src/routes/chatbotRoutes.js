// CHATBOT ROUTES - CURRENTLY DISABLED
// Uncomment this code when you want to enable AI chatbot functionality

import express from 'express';
import { getChatbotResponse } from '../controllers/chatbotController.js';
import { protect } from '../middleware/auth.js';
import { chatbotValidator } from '../middleware/validator.js';

const router = express.Router();

// Chatbot endpoint - returns 503 while disabled
router.post('/', protect, chatbotValidator, getChatbotResponse);

export default router;
