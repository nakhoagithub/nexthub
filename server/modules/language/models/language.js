import mongoose from "mongoose";

const name = "language";

const collectionName = "base.language";

const schema = new mongoose.Schema(
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

export const Language = mongoose.model(name, schema);
