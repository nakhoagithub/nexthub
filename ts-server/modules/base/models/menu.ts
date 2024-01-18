import mongoose from "mongoose";

const collectionName = "base.menu";

export const menuSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String },
    url: { type: String },
    idParent: { type: String },
    isGroup: { type: Boolean },
    sequence: { type: Number, default: 1 },
    state: { type: String, default: "nomal" },
    active: { type: Boolean, default: true },
  },
  { timestamps: true, versionKey: false, collection: collectionName }
);
