import express from 'express';
import {
  signup,
  login,
  refreshToken,
  getMe,
  updateProfile,
} from '../controllers/authController.js';
import { signupValidator, loginValidator } from '../middleware/validator.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/signup', signupValidator, signup);
router.post('/login', loginValidator, login);
router.post('/refresh', refreshToken);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

export default router;
