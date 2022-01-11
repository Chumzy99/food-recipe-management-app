import express, { Application } from 'express';
import { protect } from '../controllers/authController';
import {
  getAllRecipes,
  createRecipe,
  getRecipe,
  updateRecipe,
  deleteRecipe,
  getRecipeStats,
} from '../controllers/recipeControllers';

const router = express.Router();

router.route('/recipe-stats').get(getRecipeStats);

router.route('/').get(protect, getAllRecipes).post(createRecipe);
router.route('/:id').get(getRecipe).patch(updateRecipe).delete(deleteRecipe);
export default router;
