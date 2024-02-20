import mongoose from "mongoose";

const collectionName = "base.uom";

export const uomSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    idCate: { type: String, required: true },
    name: { type: String, required: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true, versionKey: false, collection: collectionName }
);
