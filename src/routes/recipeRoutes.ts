import express, { Application } from 'express';
import { protect } from '../controllers/authController';
import {
  getAllRecipes,
  createRecipe,
  getRecipe,
  updateRecipe,
  deleteRecipe,
  getRecipeStats,
  getEveryRecipe,
} from '../controllers/recipeControllers';

const router = express.Router();

router.route('/recipe-stats').get(getRecipeStats);
router.route('/every').get(getEveryRecipe);

router.route('/').get(protect, getAllRecipes).post(protect, createRecipe);
router.route('/:id').get(getRecipe).patch(updateRecipe).delete(deleteRecipe);
// router.route('/userId').post(createRecipe);
export default router;
