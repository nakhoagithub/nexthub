import mongoose from "mongoose";

const collectionName = "work.schedule.employee";

export const workScheduleEmployeeSchema = new mongoose.Schema(
  {
    dateStart: { type: Number, comment: "Ngày bắt đầu của khoảng thời gian sắp xếp ca làm việc theo tháng." },
    dateEnd: { type: Number, comment: "Ngày kết thúc của khoảng thời gian sắp xếp ca làm việc theo tháng." },
    workingTimeHour: { type: String, comment: "Thời gian làm việc (giờ)" },
    month: { type: Number, comment: "Tháng của lịch công việc" },
    daysInMonth: { type: Number, comment: "Số ngày của tháng" },
    year: { type: Number, comment: "Năm của lịch công việc" },
    idEmployee: {
      type: mongoose.Types.ObjectId,
      ref: "hr-employee",
      comment: "ID của bảng hr-employee để xác định nhân viên làm việc.",
    },
    idWorkSchedule: {
      type: mongoose.Types.ObjectId,
      ref: "work-schedule",
      comment: `Liên kết đến bảng work-schedule để xác định làm việc này thuộc tổ chức nào và tháng nào.`,
    },
    idWorkScheduleEmployeeDetail: { type: mongoose.Types.ObjectId, ref: "work-schedule-employee-detail" },
  },
  { timestamps: true, versionKey: false, collection: collectionName }
);
