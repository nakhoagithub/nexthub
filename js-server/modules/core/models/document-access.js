import mongoose from "mongoose";

const name = "document-access";

const collectionName = "base.document.access";

const schema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String },
    modelName: { type: String },
    filter: { type: String },
    applyForRead: { type: Boolean, default: true },
    applyForCreate: { type: Boolean, default: true },
    applyForUpdate: { type: Boolean, default: true },
    applyForDelete: { type: Boolean, default: true },
    state: { type: String, default: "nomal" },
    active: { type: Boolean, default: true },
  },
  { timestamps: true, versionKey: false, collection: collectionName }
);

export const DocumentAccess = mongoose.model(name, schema);
