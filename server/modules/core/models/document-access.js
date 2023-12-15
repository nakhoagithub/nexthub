import mongoose from "mongoose";

const name = "document-access";

const collectionName = "base.document.access";

const schema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String },
    modelName: { type: String },
    filter: { type: String },
    apply_for_read: { type: Boolean, default: true },
    apply_for_create: { type: Boolean, default: true },
    apply_for_update: { type: Boolean, default: true },
    apply_for_delete: { type: Boolean, default: true },
    state: { type: String, default: "nomal" },
    active: { type: Boolean, default: true },
  },
  { timestamps: true, versionKey: false, collection: collectionName }
);

// schema.pre("save", async function (next) {
//   try {
//     this.filter = JSON.parse(this.filter);
//     next();
//   } catch (error) {
//     next(error);
//   }
// });

export const DocumentAccess = mongoose.model(name, schema);
