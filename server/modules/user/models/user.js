import mongoose from "mongoose";
import bcrypt from "bcrypt";

const name = "user";

const collectionName = "base.user";

const schema = new mongoose.Schema(
  {
    name: { type: String },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    localeCode: { type: String, default: "en_US" },
    idsOrg: { type: [mongoose.Types.ObjectId], ref: "org" },
    idsCurrentOrg: { type: [mongoose.Types.ObjectId], ref: "org" },
    state: { type: String, default: "user" },
    session: { type: String, readonly: true },
    active: { type: Boolean, default: true },
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
