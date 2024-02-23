import mongoose from "mongoose";

const collectionName = "hr.job.position";

export const hrJobPositionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      comment: `Tên gọi của chức vụ, ví dụ: "Quản lý dự án", "Nhân viên kinh doanh", v.v.`,
    },
    description: { type: String, comment: "Mô tả ngắn về nhiệm vụ và trách nhiệm của chức vụ." },
    salaryRange: { type: String, comment: "Phạm vi lương dự kiến cho chức vụ này." },
    responsibilities: { type: String, comment: "Các nhiệm vụ cụ thể mà người giữ chức vụ này phải thực hiện." },
    requirements: {
      type: String,
      comment: "Các yêu cầu cần thiết cho người xin việc đảm nhận chức vụ này (ví dụ: bằng cấp, kinh nghiệm, kỹ năng).",
    },
    seq: { type: Number, comment: "Dùng để sắp xếp." },
    active: { type: Boolean, default: true },
  },
  { timestamps: true, versionKey: false, collection: collectionName }
);
