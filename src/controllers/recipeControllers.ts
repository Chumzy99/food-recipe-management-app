import { Request, Response, NextFunction } from 'express';
import Recipe from '../model/recipeModel';
import { validateRecipe, validateRecipeUpdate } from '../validate/validator';
import APIFeatures from '../utils/APIFeatures';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';
import { CustomUserReq } from '../model/custom';

export const getEveryRecipe = catchAsync(
  async (req: CustomUserReq, res: Response, next: NextFunction) => {
    // console.log('yessssss');
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
  }
);

export const getAllRecipes = catchAsync(
  async (req: CustomUserReq, res: Response, next: NextFunction) => {
    console.log(req.user);
    // EXECUTE QUERY
    const features = new APIFeatures(
      Recipe.find({ createdBy: req.user?._id }),
      req.query
    )
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
  }
);

export const getRecipe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const recipe = await Recipe.findById(req.params.id).populate('createdBy');
    if (!recipe) {
      return next(new AppError(`No document found with that ID`, 404));
    }

    res.status(200).json({
      status: 'success',
      data: recipe,
    });
  }
);

export const createRecipe = catchAsync(
  async (req: CustomUserReq, res: Response, next: NextFunction) => {
    // console.log(typeof req.user?._id);
    let fullBody = { ...req.body, createdBy: req.user?._id };
    // console.log(fullBody);
    const Valid = validateRecipe.validate(fullBody);
    let errorM: string = Valid.error?.details[0].message!;

    if (Valid.error) {
      return next(new AppError(errorM, 400));
    }

    const newRecipe = await Recipe.create(fullBody);

    res.status(201).json({
      status: 'success',
      data: newRecipe,
    });
  }
);

export const updateRecipe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const isValid = validateRecipeUpdate.validate(req.body);
    let errorM = isValid.error?.details[0].message;
    // console.log(errorM);

    if (isValid.error) {
      return next(new AppError(errorM, 400));
    }

    const recipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!recipe) {
      return next(new AppError(`No document found with that ID`, 404));
    }

    res.status(200).json({
      status: 'success',
      data: recipe,
    });
  }
);

export const deleteRecipe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const recipe = await Recipe.findByIdAndDelete(req.params.id);

    if (!recipe) {
      return next(new AppError(`No document found with that ID`, 404));
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  }
);

export const getRecipeStats = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
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
  }
);
