import mongoose from "mongoose";

const collectionName = "hr.department";

export const hrDepartmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, comment: `Tên của bộ phận, chẳng hạn như "Kế toán", "Nhân sự", v.v.` },
    description: { type: String, comment: "Mô tả về chức năng và mục tiêu của bộ phận." },
    idEmployeeManager: { type: mongoose.Types.ObjectId, ref: "hr-employee", comment: "ID của người quản lý bộ phận." },
    location: { type: String, comment: "Thông tin về địa điểm vị trí của bộ phận." },
    employeesCount: { type: Number, comment: "Số lượng nhân viên hiện tại thuộc bộ phận này." },
    budget: { type: String, comment: "Ngân sách được gán cho bộ phận này." },
    seq: { type: Number, comment: "Dùng để sắp xếp." },
    active: { type: Boolean, default: true },
  },
  { timestamps: true, versionKey: false, collection: collectionName }
);
