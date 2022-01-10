import { match } from 'assert';
import { Request, Response, NextFunction } from 'express';
import Recipe from '../model/recipeModel';
import { validateRecipe, validateRecipeUpdate } from '../validate/validator';
import APIFeatures from '../utils/APIFeatures';

export const getAllRecipes = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // EXECUTE QUERY
  const features = new APIFeatures(Recipe.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const recipes = await features.query;

  res.status(200).json({
    status: 'success.',
    results: recipes.length,
    data: recipes,
  });
};

export const getRecipe = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    res.status(200).json({
      status: 'success',
      data: recipe,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

export const createRecipe = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const Valid = validateRecipe.validate(req.body);
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

export const updateRecipe = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const isValid = validateRecipeUpdate.validate(req.body);
    let errorM = isValid.error?.details[0].message;

    if (isValid.error) {
      return res.status(400).json({
        status: 'fail',
        message: errorM,
      });
    }

    const recipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      data: recipe,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

export const deleteRecipe = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const recipe = await Recipe.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

export const getRecipeStats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const stats = await Recipe.aggregate([
      {
        $match: { preparationMinutes: { $gte: 40 } },
      },
      {
        $group: {
          _id: { $toUpper: '$difficulty_level' },
          num: { $sum: 1 },
          avgMinutes: { $avg: '$preparationMinutes' },
          maxTime: { $max: '$preparationMinutes' },
          minTime: { $min: '$preparationMinutes' },
        },
      },
      {
        $sort: { avgMinutes: 1 },
      },
    ]);

    res.status(200).json({
      status: 'success',
      data: stats,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

export const getRecipePlan = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};
