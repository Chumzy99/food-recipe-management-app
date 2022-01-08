import mongoose, { Schema, Document } from 'mongoose';
import validator from 'validator';

interface Recipe extends Document {
  title: string;
  meal_type: string;
  difficulty_level: string;
  ingredients: string;
  preparation: string;
  created_At: any;
  updated_At: any;
}

const recipeSchema: Schema<Recipe> = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'A recipe must have a title'],
    trim: true,
  },
  meal_type: {
    type: String,
    required: [true, 'A recipe must have a meal type'],
    trim: true,
    enum: {
      values: ['breakfast', 'lunch', 'supper', 'snack'],
      message: 'Meal type is either breakfast, lunch, supper or snack',
    },
  },
  difficulty_level: {
    type: String,
    required: [true, 'A recipe must have a difficulty level'],
    trim: true,
    enum: {
      values: ['Beginner', 'Intermediate', 'Advanced'],
      message: 'Difficulty level is either Beginner, Intermediate or Advanced ',
    },
  },
  ingredients: {
    type: String,
    required: [true, 'A recipe ingredients must be provided!'],
  },
  preparation: {
    type: String,
    required: [true, 'A recipe must have preparation steps!'],
  },
  created_At: {
    type: Date,
    default: Date.now(),
  },
  updated_At: {
    type: Date,
    default: Date.now(),
  },
});

const Recipe = mongoose.model('Recipe', recipeSchema);

export default Recipe;
