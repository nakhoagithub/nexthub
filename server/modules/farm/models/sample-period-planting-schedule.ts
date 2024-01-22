import mongoose from "mongoose";

const collectionName = "farm.sample.period.planting.schedule";

export const samplePeriodPlantingScheduleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    idSamplePlantingSchedule: { type: mongoose.Types.ObjectId, ref: "sample-period-planting-schedule" },
    sortIndex: { type: Number, default: 1 },
    numOfDays: { type: Number, default: 1 },
    isStart: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
  },
  { timestamps: true, versionKey: false, collection: collectionName }
);
