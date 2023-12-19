import mongoose from "mongoose";

const name = "template-planting-schedule";

const collectionName = "farm.template.planting.schedule";

const schema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    idBreed: { type: mongoose.Types.ObjectId, ref: "breed" },
    description: { type: String },
    numOfDaysIncurred: { type: Number },
    averageYield: { type: Number },
    active: { type: Boolean, default: true },
    idsPeriod: [{ type: mongoose.Types.ObjectId }],
  },
  { timestamps: true, versionKey: false, collection: collectionName }
);

export const TemplatePlantingSchedule = mongoose.model(name, schema);
