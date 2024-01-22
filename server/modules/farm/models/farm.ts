import mongoose from "mongoose";

const collectionName = "farm.farm";

export const farmSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    address: { type: String },
    ipPublic: { type: String, default: "" },
    ipPrivate: { type: String, default: "" },
    port: { type: Number },
    username: { type: String, default: "" },
    password: { type: String, default: "" },
    database: { type: String, default: "" },
    idOrg: { type: mongoose.Types.ObjectId, ref: "org", required: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true, versionKey: false, collection: collectionName }
);
