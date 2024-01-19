import mongoose from "mongoose";

const collectionName = "base.language";

export const languageSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    localeCode: { type: String, required: true },
    isoCode: { type: String, required: true },
    direction: { type: String },
    state: { type: String, default: "nomal" },
    active: { type: Boolean, default: true },
  },
  { timestamps: true, versionKey: false, collection: collectionName }
);
