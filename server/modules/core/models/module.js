import mongoose from "mongoose";

const name = "module";

const collectionName = "base.module";

const schema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String },
    models: [{ type: String }],
    install: { type: Boolean, default: true },
    state: { type: String, default: "nomal" },
  },
  { timestamps: true, versionKey: false, collection: collectionName }
);

export const Module = mongoose.model(name, schema);
