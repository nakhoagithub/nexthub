import mongoose from "mongoose";

const collectionName = "base.module";

export const moduleSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    version: { type: String },
    description: { type: String },
    author: { type: String },
    depends: { type: [String] },
    datas: { type: [Object] },
    models: { type: [Object] },
    state: { type: String, default: "normal" },
    installable: { type: Boolean, default: false },
    application: { type: Boolean, default: true },
  },
  { timestamps: false, versionKey: false, collection: collectionName }
);
