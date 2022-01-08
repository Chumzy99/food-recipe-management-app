import mongoose, { Schema, Document } from 'mongoose';

interface Ingredient extends Document {
  name: string;
  price: number;
  recipe: string | undefined;
  user: string | undefined;
}

const ingredientSchema: Schema<Ingredient> = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name of recipe must be provided!'],
  },
  price: {
    type: Number,
    required: [true, 'Price of Ingredient must be provided!'],
  },
  recipe: {
    type: Schema.Types.ObjectId,
    ref: 'Recipe',
    required: [true, 'Please provide recipe!'],
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide user!'],
  },
});

const Ingredient = mongoose.model('Ingredient', ingredientSchema);
export default Ingredient;
