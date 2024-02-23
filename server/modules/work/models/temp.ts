import mongoose from "mongoose";

const collectionName = "work.schedule";

export const temp = new mongoose.Schema(
  {
    idEmployee: {
      type: mongoose.Types.ObjectId,
      required: true,
      comment: `Liên kết đến bảng employee để xác định nhân viên nào sẽ có lịch trình làm việc.`,
    },
    dateStart: { type: Number, comment: "Ngày bắt đầu của khoảng thời gian sắp xếp ca làm việc." },
    dateEnd: { type: Number, comment: "Ngày kết thúc của khoảng thời gian sắp xếp ca làm việc." },
    shiftStartTime: { type: Number, comment: "Thời gian bắt đầu của ca làm việc." },
    shiftEndTime: { type: Number, comment: "Thời gian kết thúc của ca làm việc." },
    idShiftType: {
      type: mongoose.Types.ObjectId,
      ref: "work-shift-type",
      comment: "ID của loại ca làm việc, ví dụ: ca sáng, ca chiều, ca tối, v.v.",
    },
    idDepartment: {
      type: mongoose.Types.ObjectId,
      ref: "hr.department",
      comment: "Liên kết đến bảng department để xác định bộ phận nào có lịch trình này.",
    },
    location: { type: String, comment: "Địa điểm làm việc nếu có nhiều địa điểm trong tổ chức." },
    status: {
      type: String,
      comment: "Trạng thái hiện tại của lịch trình làm việc (đã xác nhận, chờ xác nhận, hủy, v.v.).",
    },
    active: { type: Boolean, default: true },
  },
  { timestamps: true, versionKey: false, collection: collectionName }
);
