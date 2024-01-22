import mongoose from "mongoose";

const collectionName = "base.model";

export const modelSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    modelName: { type: String, required: true, unique: true },
    description: { type: String },
    collectionName: { type: String, required: true },
    idsSchema: { type: [mongoose.Types.ObjectId], ref: "schema" },
    timestamp: { type: Boolean, default: true },
    versionKey: { type: Boolean, default: false },
    install: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false, collection: collectionName }
);
