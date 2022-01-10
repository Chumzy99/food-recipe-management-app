import mongoose, { Schema, Document } from 'mongoose';

interface Recipe extends Document {
  title: string;
  meal_type: string;
  difficulty_level: string;
  ingredients: string;
  preparation: string;
  createdBy: string | undefined;
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
      values: ['beginner', 'intermediate', 'advanced'],
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
  // createdBy: {
  //   type: Schema.Types.ObjectId,
  //   ref: 'User',
  //   required: [true, 'Please provide id of user'],
  // },
  createdBy: {
    type: String,
  },
  created_At: {
    type: Date,
    default: Date.now(),
    select: false,
  },
  updated_At: {
    type: Date,
    default: Date.now(),
    select: false,
  },
});

const Recipe = mongoose.model('Recipe', recipeSchema);

export default Recipe;
