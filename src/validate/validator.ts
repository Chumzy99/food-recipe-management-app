import joi from 'joi';

export const validateRecipe = joi.object({
  title: joi.string().required().trim(),
  meal_type: joi.string().required().trim(),
  difficulty_level: joi.string().required().trim(),
  ingredients: joi.string().required().trim(),
  preparation: joi.string().required(),
});

export const validateUser = joi.object({
  email: joi.string().trim().email().required(),
  fullname: joi.string().required().min(1).max(50),
  password: joi.string().required().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
});

export const validateLogin = joi.object({
  email: joi.string().trim().email().required(),
  password: joi.string().required().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
});

export const validateIngredient = joi.object({
  name: joi.string().trim().required(),
  price: joi.number().required(),
  recipe: joi.string().trim(),
  user: joi.string().trim(),
});
