import mongoose from "mongoose";

const name = "farm";

const collectionName = "farm.farm";

const schema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    address: { type: String },
    ipPublic: { type: String, default: "" },
    ipPrivate: { type: String, default: "" },
    port: { type: Number, default: 27017 },
    username: { type: String, default: "" },
    password: { type: String, default: "" },
    database: { type: String, default: "" },
    idSensorTempinside: { type: mongoose.Types.ObjectId, ref: "sensor" },
    idSensorTempOutside: { type: mongoose.Types.ObjectId, ref: "sensor" },
    idSensorHumInside: { type: mongoose.Types.ObjectId, ref: "sensor" },
    idSensorHumOutside: { type: mongoose.Types.ObjectId, ref: "sensor" },
    idSensorLuxInside: { type: mongoose.Types.ObjectId, ref: "sensor" },
    idSensorLuxOutside: { type: mongoose.Types.ObjectId, ref: "sensor" },
    idOrg: { type: mongoose.Types.ObjectId, ref: "org" },
    active: { type: Boolean, default: true },
  },
  { timestamps: true, versionKey: false, collection: collectionName }
);

export const Farm = mongoose.model(name, schema);
