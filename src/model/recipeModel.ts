import { required } from 'joi';
import mongoose, { Schema, Document } from 'mongoose';

interface IRecipe extends Document {
  title: string;
  meal_type: string;
  difficulty_level: string;
  ingredients: string;
  preparationMinutes: number;
  preparation: string;
  createdBy: string | undefined;
  created_At: any;
  updated_At: any;
}

const recipeSchema: Schema<IRecipe> = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'A recipe must have a title'],
      trim: true,
    },
    preparationMinutes: {
      type: Number,
      required: [true, 'A recipe must have preparation hour Estimated'],
      default: 1,
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
        message:
          'Difficulty level is either Beginner, Intermediate or Advanced ',
      },
    },
    ingredients: [
      {
        name: String,
        price: Number,
      },
      // required: [true, "ingredient(s) for recipe should be provided"]
    ],
    preparation: {
      type: String,
      required: [true, 'A recipe must have preparation steps!'],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide id of user'],
    },
    created_At: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    updated_At: {
      type: Date,
      default: Date.now(),
      select: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual prperties
recipeSchema.virtual('preparationTimeInHours').get(function (this: IRecipe) {
  let time = Math.round(this.preparationMinutes / 60);
  return time;
});

// recipeSchema.pre('findOneAndUpdate', function(next) {
// })

const Recipe = mongoose.model('Recipe', recipeSchema);

export default Recipe;
