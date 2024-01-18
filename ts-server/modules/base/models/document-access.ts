import mongoose from "mongoose";

const collectionName = "base.document.access";

export const documentAccessSchema = new mongoose.Schema(
  {
    id: { type: String },
    name: { type: String, required: true },
    description: { type: String },
    idModel: { type: String },
    filter: { type: String },
    apply_for_read: { type: Boolean, default: true },
    apply_for_create: { type: Boolean, default: true },
    apply_for_update: { type: Boolean, default: true },
    apply_for_delete: { type: Boolean, default: true },
    state: { type: String, default: "nomal" },
    active: { type: Boolean, default: true },
  },
  { timestamps: true, versionKey: false, collection: collectionName }
);
