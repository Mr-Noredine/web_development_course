import express from 'express';
import {
  getAllExercises,
  getExercisesGrouped,
  getExerciseById,
  submitAttempt,
  getCategories
} from '../controllers/exercisesController.js';

const router = express.Router();

// GET /api/exercises - Get all exercises (with filters)
router.get('/', getAllExercises);

// GET /api/exercises/grouped - Get exercises grouped by category/level
router.get('/grouped', getExercisesGrouped);

// GET /api/exercises/categories - Get all categories
router.get('/categories', getCategories);

// GET /api/exercises/:id - Get single exercise
router.get('/:id', getExerciseById);

// POST /api/exercises/attempt - Submit exercise attempt
router.post('/attempt', submitAttempt);

export default router;
