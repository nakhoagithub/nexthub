import mongoose from "mongoose";

const name = "group";

const collectionName = "base.group";

export const groupSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String },
    idParent: { type: mongoose.Types.ObjectId, ref: name },
    idsUser: { type: [mongoose.Types.ObjectId], ref: "user" },
    idsAccess: { type: [mongoose.Types.ObjectId], ref: "access" },
    idsDocumentAccess: { type: [mongoose.Types.ObjectId], ref: "document-access" },
    idsMenu: { type: [mongoose.Types.ObjectId], ref: "menu" },
    state: { type: String, default: "nomal" },
    active: { type: Boolean, default: true },
  },
  { timestamps: true, versionKey: false, collection: collectionName }
);
