import mongoose from "mongoose";

const name = "sample-planting-schedule";

const collectionName = "farm.sample.planting.schedule";

const schema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    idBreed: { type: mongoose.Types.ObjectId, ref: "breed" },
    description: { type: String },
    numOfDaysIncurred: { type: Number },
    averageYield: { type: Number },
    active: { type: Boolean, default: true },
    idsPeriod: { type: [mongoose.Types.ObjectId] },
  },
  { timestamps: true, versionKey: false, collection: collectionName }
);

export const SamplePlantingSchedule = mongoose.model(name, schema);
