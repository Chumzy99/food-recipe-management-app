import express, { Application } from 'express';
import { getAllRecipes, createRecipe } from '../controllers/recipeControllers';

const router = express.Router();

router.route('/').get(getAllRecipes).post(createRecipe);

export default router;
