import mongoose from "mongoose";
import { enumActionType } from "./cron-action";

const collectionName = "schedule.cron.action.history";

export const scheduleCronSchema = new mongoose.Schema(
  {
    actionType: { type: String, required: true, comment: "Kiểu hành động", enum: enumActionType },
    idAction: { type: mongoose.Types.ObjectId, ref: "schedule-cron-action", comment: "ID xác định hành động" },
    idCron: { type: mongoose.Types.ObjectId, ref: "schedule-cron", comment: "ID cronjob" },
    httpResponse: { type: String, comment: "Thông tin phản hồi của API" },
    httpStatusCode: { type: String, comment: "Trạng thái của phải hồi API" },
    error: { type: String, comment: "Lỗi được ghi lại" },
    isSuccess: { type: Boolean, comment: "Hành động này thành công" },
    dateUnix: { type: Number, comment: "Thời gian thực hiện hành động" },
  },
  { timestamps: true, versionKey: false, collection: collectionName }
);
