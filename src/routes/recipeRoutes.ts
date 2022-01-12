import express, { Application } from 'express';
import app from '../app';
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

router.route('/').get(getAllRecipes).post(createRecipe);
router.route('/:id').get(getRecipe).patch(updateRecipe).delete(deleteRecipe);
// router.route('/userId').post(createRecipe);
export default router;
