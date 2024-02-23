import mongoose from "mongoose";

const collectionName = "schedule.cron";

export const scheduleCronSchema = new mongoose.Schema(
  {
    name: { type: String, comment: "Tên của cronjob" },
    dateStart: { type: Number, comment: "Thời gian bắt đầu" },
    dateEnd: { type: Number, comment: "Thời gian hết hạn" },
    cronTabExpression: { type: String, comment: "Biểu thức của lịch trình" },
    idsAction: {
      type: [mongoose.Types.ObjectId],
      ref: "schedule-cron-action",
      comment: "ID của bảng schedule-cron-action xác định các hành động của lịch trình này",
    },
    active: { type: Boolean, default: true },
  },
  { timestamps: true, versionKey: false, collection: collectionName }
);
