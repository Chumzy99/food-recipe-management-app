import mongoose, { Schema, Document } from 'mongoose';

interface Ingredient extends Document {
  name: string;
  price: number;
  recipe: string | undefined;
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
});

const Ingredient = mongoose.model('Ingredient', ingredientSchema);
export default Ingredient;
