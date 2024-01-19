import mongoose from "mongoose";

const name = "menu";

const collectionName = "base.menu";

const schema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String },
    url: { type: String },
    idParent: { type: String },
    isGroup: { type: Boolean },
    sequence: { type: Number, default: 1 },
    state: { type: String, default: "nomal" },
    active: { type: Boolean, default: true },
  },
  { timestamps: true, versionKey: false, collection: collectionName }
);

export const Menu = mongoose.model(name, schema);
