import mongoose from "mongoose";

const name = "area";

const collectionName = "farm.area";

const schema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String },
    idFarm: { type: mongoose.Types.ObjectId, ref: "farm" },
    description: { type: String },
    sortIndex: { type: Number },
    active: { type: Boolean, default: true },
  },
  { timestamps: true, versionKey: false, collection: collectionName }
);

export const Area = mongoose.model(name, schema);
