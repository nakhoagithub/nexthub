import mongoose from "mongoose";

const name = "schema";

const collectionName = "base.schema";

const types = ["String", "Boolean", "Object", "ObjectId", "Array", "ArrayObjectId"];

const schema = new mongoose.Schema(
  {
    id: { type: String },
    modelName: { type: String },
    comment: { type: String },
    field: { type: String, required: true },
    type: { type: String, required: true, enum: types },
    required: { type: Boolean },
    unique: { type: Boolean },
    readonly: { type: Boolean },
    default: { type: Object },
    select: { type: Boolean }, // select: `false` thì trường này sẽ không đọc hay cập nhật
    ref: { type: String },
  },
  { timestamps: true, versionKey: false, collection: collectionName }
);

export const Schema = mongoose.model(name, schema);
