import mongoose from "mongoose";

const collectionName = "work.schedule.employee.detail";

export const workScheduleEmployeeDetailSchema = new mongoose.Schema(
  {
    month: { type: Number, comment: "Tháng của lịch công việc" },
    daysInMonth: { type: Number, comment: "Số ngày của tháng" },
    year: { type: Number, comment: "Năm của lịch công việc" },
    day1Job: { type: String, comment: "Mô tả/Phân công công việc ngày 1" },
    day2Job: { type: String, comment: "Mô tả/Phân công công việc ngày 2" },
    day3Job: { type: String, comment: "Mô tả/Phân công công việc ngày 3" },
    day4Job: { type: String, comment: "Mô tả/Phân công công việc ngày 4" },
    day5Job: { type: String, comment: "Mô tả/Phân công công việc ngày 5" },
    day6Job: { type: String, comment: "Mô tả/Phân công công việc ngày 6" },
    day7Job: { type: String, comment: "Mô tả/Phân công công việc ngày 7" },
    day8Job: { type: String, comment: "Mô tả/Phân công công việc ngày 8" },
    day9Job: { type: String, comment: "Mô tả/Phân công công việc ngày 9" },
    day10Job: { type: String, comment: "Mô tả/Phân công công việc ngày 10" },
    day11Job: { type: String, comment: "Mô tả/Phân công công việc ngày 11" },
    day12Job: { type: String, comment: "Mô tả/Phân công công việc ngày 12" },
    day13Job: { type: String, comment: "Mô tả/Phân công công việc ngày 13" },
    day14Job: { type: String, comment: "Mô tả/Phân công công việc ngày 14" },
    day15Job: { type: String, comment: "Mô tả/Phân công công việc ngày 15" },
    day16Job: { type: String, comment: "Mô tả/Phân công công việc ngày 16" },
    day17Job: { type: String, comment: "Mô tả/Phân công công việc ngày 17" },
    day18Job: { type: String, comment: "Mô tả/Phân công công việc ngày 18" },
    day19Job: { type: String, comment: "Mô tả/Phân công công việc ngày 19" },
    day20Job: { type: String, comment: "Mô tả/Phân công công việc ngày 20" },
    day21Job: { type: String, comment: "Mô tả/Phân công công việc ngày 21" },
    day22Job: { type: String, comment: "Mô tả/Phân công công việc ngày 22" },
    day23Job: { type: String, comment: "Mô tả/Phân công công việc ngày 23" },
    day24Job: { type: String, comment: "Mô tả/Phân công công việc ngày 24" },
    day25Job: { type: String, comment: "Mô tả/Phân công công việc ngày 25" },
    day26Job: { type: String, comment: "Mô tả/Phân công công việc ngày 26" },
    day27Job: { type: String, comment: "Mô tả/Phân công công việc ngày 27" },
    day28Job: { type: String, comment: "Mô tả/Phân công công việc ngày 28" },
    day29Job: { type: String, comment: "Mô tả/Phân công công việc ngày 29" },
    day30Job: { type: String, comment: "Mô tả/Phân công công việc ngày 30" },
    day31Job: { type: String, comment: "Mô tả/Phân công công việc ngày 31" },
    idWorkScheduleEmployee: {
      type: mongoose.Types.ObjectId,
      ref: "work-schedule-employee",
      comment: `Liên kết đến bảng work-schedule-employee để xác định chi tiết công việc này thuộc nhân viên nào.`,
    },
  },
  { timestamps: true, versionKey: false, collection: collectionName }
);
