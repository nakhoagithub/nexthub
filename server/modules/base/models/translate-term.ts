import mongoose from "mongoose";

const collectionName = "base.translate.term";

export const translateTermSchema = new mongoose.Schema(
  {
    sourceTerm: { type: String },
    translationValue: { type: String },
    localeCode: { type: String },
    modelName: { type: String },
    state: { type: String, default: "nomal" },
    active: { type: Boolean, default: true },
  },
  { timestamps: true, versionKey: false, collection: collectionName }
);
