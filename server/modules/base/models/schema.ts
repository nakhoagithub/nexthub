import mongoose from "mongoose";

const collectionName = "base.schema";

const types = ["String", "Boolean", "Object", "ObjectId", "Array", "ArrayObjectId"];

export const schemaSchema = new mongoose.Schema(
  {
    id: { type: String },
    title: { type: String },
    idModel: { type: String },
    comment: { type: String },
    field: { type: String, required: true },
    type: { type: String, required: true, enum: types },
    required: { type: Boolean },
    unique: { type: Boolean },
    readonly: { type: Boolean },
    default: { type: Object },
    select: { type: Boolean }, // select: `false` thì trường này sẽ không đọc hay cập nhật
    ref: { type: String },
    sortColumn: { type: Number, default: 1 },
  },
  { timestamps: true, versionKey: false, collection: collectionName }
);
