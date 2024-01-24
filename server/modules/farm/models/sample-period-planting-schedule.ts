import mongoose from "mongoose";
import { logger } from "../../../utils/logger";

const collectionName = "farm.sample.period.planting.schedule";

export const samplePeriodPlantingScheduleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    idSamplePlantingSchedule: { type: mongoose.Types.ObjectId, ref: "sample-planting-schedule" },
    sortIndex: { type: Number, required: true },
    numOfDays: { type: Number, required: true },
    isStart: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
  },
  { timestamps: true, versionKey: false, collection: collectionName }
);

async function customSamplePeriodPlantingScheduleSchema(this: any, doc: any, next: any, type: "save" | "update") {
  try {
    const SamplePeriodPlantingSchedule = mongoose.model("sample-period-planting-schedule");
    if (doc?.isStart === true) {
      await SamplePeriodPlantingSchedule.updateMany(
        { idSamplePlantingSchedule: doc?.idSamplePlantingSchedule, _id: { $ne: doc?._id } },
        { isStart: false }
      );
    }
  } catch (error) {
    logger({ message: error, name: `customSamplePeriodPlantingScheduleSchema: ${error}` });
  }
}

samplePeriodPlantingScheduleSchema.pre("save", async function (next) {
  let newDoc: any = this;
  await customSamplePeriodPlantingScheduleSchema.call(this, newDoc, next, "save");
});

samplePeriodPlantingScheduleSchema.pre("updateOne", async function (next) {
  const updateData = (this as any)._update;
  await customSamplePeriodPlantingScheduleSchema.call(updateData, updateData, next, "update");
});
