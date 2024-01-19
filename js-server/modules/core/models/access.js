import mongoose from "mongoose";

const name = "access";

const collectionName = "base.access";

const schema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String },
    modelName: { type: String },
    read: { type: Boolean, default: true },
    create: { type: Boolean, default: true },
    update: { type: Boolean, default: true },
    delete: { type: Boolean, default: true },
    state: { type: String, default: "nomal" },
    active: { type: Boolean, default: true },
  },
  { timestamps: true, versionKey: false, collection: collectionName }
);

export const Access = mongoose.model(name, schema);
