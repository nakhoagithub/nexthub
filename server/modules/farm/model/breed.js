import mongoose from "mongoose";

const name = "breed";

const collectionName = "farm.breed";

const schema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String },
    idBreedCategory: { type: mongoose.Types.ObjectId, ref: "breed-category", required: true },
    active: { type: Boolean, default: true },
    idOrg: { type: mongoose.Types.ObjectId, ref: "org", required: true },
  },
  { timestamps: true, versionKey: false, collection: collectionName }
);

export const Breed = mongoose.model(name, schema);
