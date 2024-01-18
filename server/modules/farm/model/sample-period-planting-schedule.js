import mongoose from "mongoose";

const name = "sample-period-planting-schedule";

const collectionName = "farm.sample.period.planting.schedule";

const schema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    sortIndex: { type: Number, default: 1 },
    numOfDays: { type: Number, default: 1 },
  },
  { timestamps: true, versionKey: false, collection: collectionName }
);

export const SamplePeriodPlantingSchedule = mongoose.model(name, schema);
