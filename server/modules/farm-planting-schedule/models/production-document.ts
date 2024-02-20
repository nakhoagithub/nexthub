import mongoose from "mongoose";
import { logger } from "../../../utils/logger";

const collectionName = "farm.production.document";

export const productionDocumentSchema = new mongoose.Schema(
  {
    day: { type: Number },
    month: { type: Number },
    year: { type: Number },
    dateUnix: { type: Number },
    idArea: { type: mongoose.Types.ObjectId, ref: "area" },
    idPlantingSchedule: { type: mongoose.Types.ObjectId, ref: "planting-schedule" },
    codePlantingSchedule: { type: String },
    contentWorkDiary: { type: String },
    contentGardenCheckDiary: { type: String },
    contentDiseaseManagement: { type: String },
  },
  { timestamps: true, versionKey: false, collection: collectionName }
);
