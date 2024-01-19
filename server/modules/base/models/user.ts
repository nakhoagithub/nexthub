import mongoose from "mongoose";

const userCollection = "base.user";

export const userSchema = new mongoose.Schema(
  {
    name: { type: String },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    localeCode: { type: String, default: "en_US" },
    idsOrg: { type: [mongoose.Types.ObjectId], ref: "org", default: [] },
    idsCurrentOrg: { type: [mongoose.Types.ObjectId], ref: "org", default: [] },
    state: { type: String, default: "user" },
    session: { type: String, readonly: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true, versionKey: false, collection: userCollection }
);
