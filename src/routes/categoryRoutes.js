import express from 'express';
import {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController.js';
import { protect, authorize } from '../middleware/auth.js';
import { categoryValidator, idValidator } from '../middleware/validator.js';

const router = express.Router();

router
  .route('/')
  .get(getCategories)
  .post(protect, authorize('admin'), categoryValidator, createCategory);

router
  .route('/:id')
  .get(idValidator, getCategory)
  .put(protect, authorize('admin'), idValidator, categoryValidator, updateCategory)
  .delete(protect, authorize('admin'), idValidator, deleteCategory);

export default router;
