import express from 'express';
import {
  getCompetitions,
  getCompetition,
  getCompetitionsCalendar,
  createCompetition,
  updateCompetition,
  deleteCompetition,
} from '../controllers/competitionController.js';
import { protect, authorize } from '../middleware/auth.js';
import { competitionValidator, idValidator } from '../middleware/validator.js';

const router = express.Router();

router.get('/calendar', getCompetitionsCalendar);

router
  .route('/')
  .get(getCompetitions)
  .post(protect, authorize('admin'), competitionValidator, createCompetition);

router
  .route('/:id')
  .get(idValidator, getCompetition)
  .put(protect, authorize('admin'), idValidator, competitionValidator, updateCompetition)
  .delete(protect, authorize('admin'), idValidator, deleteCompetition);

export default router;
