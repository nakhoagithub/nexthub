import mongoose from "mongoose";

const name = "org";

const collectionName = "base.org";

const schema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    shortName: { type: String },
    address: { type: String },
    phone: { type: String },
    email: { type: String },
    vat: { type: String },
    idParent: { type: mongoose.Types.ObjectId, ref: "org" },
    currency: { type: mongoose.Types.ObjectId },
    description: { type: String },
    state: { type: String },
    sequence: { type: Number, default: 1 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true, versionKey: false, collection: collectionName }
);

export const Org = mongoose.model(name, schema);
