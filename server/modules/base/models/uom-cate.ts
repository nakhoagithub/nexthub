import mongoose from "mongoose";

const collectionName = "base.uom.cate";

export const uomCateSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    measureType: { type: String, required: true },
  },
  { timestamps: true, versionKey: false, collection: collectionName }
);
