import mongoose from "mongoose";

const name = "translate-term";

const collectionName = "base.translate.term";

const schema = new mongoose.Schema(
  {
    sourceTerm: { type: String },
    translationValue: { type: String },
    localeCode: { type: String },
    state: { type: String, default: "nomal" },
    active: { type: Boolean, default: true },
  },
  { timestamps: true, versionKey: false, collection: collectionName }
);

export const TranslateTerm = mongoose.model(name, schema);
