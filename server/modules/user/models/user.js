import mongoose from "mongoose";
import bcrypt from "bcrypt";

const name = "user";

const collectionName = "base.user";

const schema = new mongoose.Schema(
  {
    name: { type: String },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    session: { type: String, readonly: true },
    state: { type: String, default: "user" },
    active: { type: Boolean, default: true },
    idsOrg: [{ type: mongoose.Types.ObjectId, ref: "org" }],
    idsCurrentOrg: [{ type: mongoose.Types.ObjectId, ref: "org" }],
    localeCode: { type: String, default: "en_US" },
  },
  { timestamps: true, versionKey: false, collection: collectionName }
);

schema.pre("save", async function (next) {
  try {
    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

export const User = mongoose.model(name, schema);
