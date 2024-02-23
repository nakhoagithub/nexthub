import mongoose from "mongoose";
import { logger } from "../../../utils/logger";
import moment from "moment";

const collectionName = "hr.employee";

const employeeStatusEnum = ["working", "resign", "on-leave"];

export const hrEmployeeSchema = new mongoose.Schema(
  {
    code: { type: String },
    firstName: { type: String, comment: "Tên riêng của nhân viên." },
    lastName: { type: String, comment: "Họ của nhân viên." },
    fullName: { type: String, required: true, comment: "Tên đầy đủ của nhân viên." },
    dateOfBirth: { type: Number, comment: "Ngày sinh của nhân viên." }, // timestamp
    gender: { type: String, comment: "Giới tính của nhân viên." },
    address: { type: String, comment: "Địa chỉ cư trú của nhân viên." },
    phone: { type: String, comment: "Số điện thoại liên lạc của nhân viên." },
    email: { type: String, comment: "Địa chỉ email của nhân viên." },
    idJobPosition: {
      type: mongoose.Types.ObjectId,
      ref: "hr-job-position",
      comment: "Chức vụ hiện tại của nhân viên trong tổ chức.",
    },
    idDepartment: {
      type: mongoose.Types.ObjectId,
      ref: "hr-department",
      comment: "Phòng ban hoặc bộ phận mà nhân viên thuộc về.",
    },
    salary: { type: String, comment: "Mức lương của nhân viên." },
    hireDate: { type: Number, comment: "Ngày mà nhân viên được tuyển dụng." }, // timestamp
    terminationDate: { type: Number, comment: "Ngày nhân viên nghỉ việc, nếu có." }, // timestamp
    idEmployeeManager: {
      type: mongoose.Types.ObjectId,
      ref: "hr-employee",
      comment: "ID của người quản lý của nhân viên.",
    },
    employeeStatus: {
      type: String,
      enum: employeeStatusEnum,
      comment: "Tình trạng hiện tại của nhân viên (hoạt động, nghỉ việc, nghỉ phép, v.v.).",
    },
    idUser: { type: mongoose.Types.ObjectId, ref: "user", comment: "ID của tài khoản người dùng." },
    idsOrg: { type: [mongoose.Types.ObjectId], ref: "org", comment: "ID(s) của tổ chức." },
    seq: { type: Number, comment: "Dùng để sắp xếp." },
    active: { type: Boolean, default: true },
  },
  { timestamps: true, versionKey: false, collection: collectionName }
);

async function customEmploye(this: any, doc: any, next: any, type: "save" | "update") {
  try {
    if (this.terminationDate) {
      if (moment().unix() <= this.terminationDate) {
        this.employeeStatus = "resign";
      }
    } else {
      this.employeeStatus = "working";
    }
  } catch (error) {
    logger({ message: error, name: "customEmploye" });
    return next(Error(`${error}`));
  }
}

hrEmployeeSchema.pre("save", async function (next) {
  let newDoc: any = this;
  await customEmploye.call(this, newDoc, next, "save");
});

hrEmployeeSchema.pre("updateOne", async function (next) {
  const updateData = (this as any)._update;
  await customEmploye.call(updateData, updateData, next, "update");
});
