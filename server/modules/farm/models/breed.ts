import mongoose from "mongoose";

const collectionName = "farm.breed";

export const breedSchema = new mongoose.Schema(
  {
    code: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String },
    idBreedCategory: { type: mongoose.Types.ObjectId, ref: "breed-category", required: true },
    active: { type: Boolean, default: true },
    idOrg: { type: mongoose.Types.ObjectId, ref: "org", required: true },
  },
  { timestamps: true, versionKey: false, collection: collectionName }
);
