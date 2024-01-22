import mongoose from "mongoose";

const collectionName = "farm.area";

export const areaSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    idParent: { type: mongoose.Types.ObjectId },
    idFarm: { type: mongoose.Types.ObjectId, ref: "farm" },
    description: { type: String },
    sortIndex: { type: Number },
    active: { type: Boolean, default: true },
  },
  { timestamps: true, versionKey: false, collection: collectionName }
);
