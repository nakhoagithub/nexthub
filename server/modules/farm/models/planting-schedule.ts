import mongoose from "mongoose";

const collectionName = "farm.planting.schedule";

export const plantingScheduleSchema = new mongoose.Schema(
  {
    code: { type: String },
    idFarm: { type: mongoose.Types.ObjectId, ref: "farm" },
    idArea: { type: mongoose.Types.ObjectId, ref: "area" },
    idBreed: { type: mongoose.Types.ObjectId, ref: "breed" },
    numberOfSeasons: { type: Number, comment: "Số mùa vụ" },
    idSamplePlantingSchedule: { type: mongoose.Types.ObjectId, ref: "sample-planting-schedule" },
    dateStartPlanting: { type: Number, comment: "Ngày bắt đầu" },
    dateEndPlanting: { type: Number, comment: "Ngày kết thúc" },
    dateStartProductionDocument: { type: Number, comment: "Ngày bắt đầu nhập hồ sơ sản xuất" },
    dateEndProductionDocument: { type: Number, comment: "Ngày kết thúc nhập hồ sơ sản xuất" },
    actualNumberOfPlants: { type: Number, comment: "Số cây trồng thực tế", default: 0 }, // số cây trồng thực thế
    totalOfPlants: { type: Number, comment: "Tổng số cây trồng", default: 0 },
    quantity: { type: Number, comment: "Sản lượng thực tế", default: 0 },
    quantityExpected: { type: Number, comment: "Sản lượng dự kiến", default: 0 },
    status: { type: String, comment: "Trạng thái lịch trình", default: "create" },
    comment: { type: String, default: "" },
  },
  { timestamps: true, versionKey: false, collection: collectionName }
);
