import mongoose from "mongoose";

const collectionName = "farm.breed.category";

export const breedCategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    idsOrg: { type: [mongoose.Types.ObjectId], ref: "org" },
    active: { type: Boolean, default: true },
  },
  { timestamps: true, versionKey: false, collection: collectionName }
);
