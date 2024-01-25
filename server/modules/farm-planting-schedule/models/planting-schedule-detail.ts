import mongoose, { CallbackWithoutResultAndOptionalError } from "mongoose";
import { logger } from "../../../utils/logger";

const collectionName = "farm.planting.schedule.detail";

export const plantingScheduleDetailSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    idBreed: { type: mongoose.Types.ObjectId, ref: "breed" },
    description: { type: String },
    numOfDaysIncurred: { type: Number, default: 0 },
    averageYield: { type: Number, default: 0 },
    idPlantingScheduleDetail: { type: mongoose.Types.ObjectId, ref: "planting-schedule-detail" },
    idPlantingSchedule: { type: mongoose.Types.ObjectId, ref: "planting-schedule" },
  },
  { timestamps: true, versionKey: false, collection: collectionName }
);
