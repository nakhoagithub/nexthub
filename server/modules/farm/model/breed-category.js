import mongoose from "mongoose";

const name = "breed-category";

const collectionName = "farm.breed.category";

const schema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    active: { type: Boolean, default: true },
  },
  { timestamps: true, versionKey: false, collection: collectionName }
);

export const BreedCategory = mongoose.model(name, schema);
