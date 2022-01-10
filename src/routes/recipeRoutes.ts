import express, { Application } from 'express';
import {
  getAllRecipes,
  createRecipe,
  getRecipe,
  updateRecipe,
  deleteRecipe,
} from '../controllers/recipeControllers';

const router = express.Router();

router.route('/').get(getAllRecipes).post(createRecipe);
router.route('/:id').get(getRecipe).patch(updateRecipe).delete(deleteRecipe);
export default router;
