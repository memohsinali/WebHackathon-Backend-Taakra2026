import express from 'express';
import { getStats, addSupportMember, getAllUsers } from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';
import { body } from 'express-validator';
import { validate } from '../middleware/validator.js';

const router = express.Router();

router.use(protect, authorize('admin'));

router.get('/stats', getStats);
router.get('/users', getAllUsers);
router.post(
  '/support',
  [body('email').isEmail().withMessage('Valid email is required'), validate],
  addSupportMember
);

export default router;
