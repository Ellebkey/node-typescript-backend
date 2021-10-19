import { Schema, model } from 'mongoose';

interface Recipe {
  name: string;
}

const schema = new Schema<Recipe>({
  name: { type: String, required: true },
});

const RecipeModel = model<Recipe>('Recipe', schema);

export default RecipeModel;
