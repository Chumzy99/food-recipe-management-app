import express, { Request, Response, NextFunction } from 'express';
import { valid } from 'joi';
import Recipe from '../model/recipeModel';
import { validateRecipe } from '../validate/validator';

export const getAllRecipes = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const recipes = await Recipe.find();

  res.status(200).json({
    status: 'success.',
    results: recipes.length,
    data: recipes,
  });
};

export const createRecipe = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const Valid = validateRecipe.validate(req.body);
    console.log(Valid.error?.details[0].message);
    let errorM = Valid.error?.details[0].message;

    if (Valid.error) {
      return res.status(400).json({
        status: 'fail',
        message: errorM,
      });
    }

    const newRecipe = await Recipe.create(req.body);

    res.status(201).json({
      status: 'success',
      data: newRecipe,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};
