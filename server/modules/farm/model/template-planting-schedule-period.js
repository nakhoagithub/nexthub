import mongoose from "mongoose";

const name = "template-planting-schedule-period";

const collectionName = "farm.template.planting.schedule.period";

const schema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    sortIndex: { type: Number, default: 1 },
    numOfDays: { type: Number, default: 1 },
  },
  { timestamps: true, versionKey: false, collection: collectionName }
);

export const TemplatePlantingSchedulePeriod = mongoose.model(name, schema);
