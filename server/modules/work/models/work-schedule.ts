import mongoose from "mongoose";

const collectionName = "work.schedule";

export const workScheduleSchema = new mongoose.Schema(
  {
    dateStart: { type: Number, comment: "Ngày bắt đầu của khoảng thời gian sắp xếp ca làm việc theo tháng." },
    dateEnd: { type: Number, comment: "Ngày kết thúc của khoảng thời gian sắp xếp ca làm việc theo tháng." },
    workingTimeHour: { type: String, comment: "Thời gian làm việc (giờ)" }, // ví dụ: 8 giờ
    month: { type: Number, comment: "Tháng của lịch công việc" },
    daysInMonth: { type: Number, comment: "Số ngày của tháng" },
    year: { type: Number, comment: "Năm của lịch công việc" },
    idsWorkScheduleEmployee: {
      type: mongoose.Types.ObjectId,
      ref: "work-schedule-employee",
      comment: "ID(s) của bảng work-schedule-employee để xác định tháng này có nhân viên nào làm việc.",
    },
    idOrg: {
      type: mongoose.Types.ObjectId,
      ref: "org",
      comment: `Liên kết đến bảng org để xác định tổ chức nào sẽ có lịch trình làm việc này.`,
    },
    active: { type: Boolean, default: true },
  },
  { timestamps: true, versionKey: false, collection: collectionName }
);