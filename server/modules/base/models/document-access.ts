import mongoose from "mongoose";

const collectionName = "base.document.access";

export const documentAccessSchema = new mongoose.Schema(
  {
    id: { type: String },
    name: { type: String, required: true },
    description: { type: String },
    idModel: { type: String },
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
