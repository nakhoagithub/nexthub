import mongoose from "mongoose";

const collectionName = "farm.production.document.disease.management";

export const productionDocumentDiseaseMamagementSchema = new mongoose.Schema(
  {
    day: { type: Number },
    month: { type: Number },
    year: { type: Number },
    dateUnix: { type: Number },
    idArea: { type: mongoose.Types.ObjectId, ref: "area" },
    idPlantingSchedule: { type: mongoose.Types.ObjectId, ref: "planting-schedule" },
    codePlantingSchedule: { type: String },
    content: { type: String, default: "" },
  },
  { timestamps: true, versionKey: false, collection: collectionName }
);

productionDocumentDiseaseMamagementSchema.index({ dateUnix: 1 });
