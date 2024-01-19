import mongoose from "mongoose";

const name = "module";

const collectionName = "base.module";

const schema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String },
    models: [{ type: String }],
    datas: [{ type: Object }],
    noUpdate: { type: Boolean },
    install: { type: Boolean, default: false },
    state: { type: String, default: "nomal" },
  },
  { timestamps: true, versionKey: false, collection: collectionName }
);

export const Module = mongoose.model(name, schema);
