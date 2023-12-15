import mongoose from "mongoose";

const name = "model";

const collectionName = "base.model";

const schema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String },
    collectionName: { type: String, required: true },
    idsSchema: [{ type: mongoose.Types.ObjectId, ref: "schema" }],
    timestamp: { type: Boolean, default: true },
    versionKey: { type: Boolean, default: false },
    install: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false, collection: collectionName }
);

export const Model = mongoose.model(name, schema);
