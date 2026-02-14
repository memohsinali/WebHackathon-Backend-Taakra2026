import express from 'express';
import { getChatHistory, getConversations } from '../controllers/chatController.js';
import { protect } from '../middleware/auth.js';
import { userIdValidator } from '../middleware/validator.js';

const router = express.Router();

router.use(protect);

router.get('/conversations', getConversations);
router.get('/:userId', userIdValidator, getChatHistory);

export default router;
