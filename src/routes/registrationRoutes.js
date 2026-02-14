import express from 'express';
import {
  createRegistration,
  getMyRegistrations,
  getAllRegistrations,
  approveRegistration,
  deleteRegistration,
} from '../controllers/registrationController.js';
import { protect, authorize } from '../middleware/auth.js';
import { registrationValidator, idValidator } from '../middleware/validator.js';

const router = express.Router();

router
  .route('/')
  .post(protect, registrationValidator, createRegistration)
  .get(protect, authorize('admin', 'support'), getAllRegistrations);

router.get('/my', protect, getMyRegistrations);

router.put('/:id/approve', protect, authorize('admin'), idValidator, approveRegistration);

router.delete('/:id', protect, idValidator, deleteRegistration);

export default router;
