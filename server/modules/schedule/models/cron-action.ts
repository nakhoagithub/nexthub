import mongoose from "mongoose";

const collectionName = "schedule.cron.action";

export const enumActionType = ["call-api"];
export const enumActionModel = ["create", "update", "delete"];

export const scheduleCronSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    actionType: { type: String, required: true, comment: "Kiểu hành động", enum: enumActionType },
    // API
    urlAPI: { type: String, comment: "Đường dẫn API" },
    methodAPI: { type: String, comment: "Phương thức API" },
    queryAPI: { type: String, comment: "Truy vấn của API" },
    bodyAPI: { type: String, comment: "Body của API" },
    timeoutAPI: { type: String, comment: "Thời gian chờ phản hồi API" },
    successWithStatus3xx: { type: Boolean, comment: "Thành công với mã trạng thái 3xx" },

    // thêm/sửa/xóa dữ liệu vào bảng
    modelName: { type: String, comment: "Tên bảng" },
    typeActionModel: { type: String, comment: "Kiểu hành động (thêm, sửa, xóa)", enum: enumActionModel },
    filterModel: { type: String, comment: "Lọc các trường trong bảng, áp dụng cho sửa và xóa" },
    data: { type: String, comment: "Dữ liệu cần thêm, cập nhật vào bảng" },

    successAction: {
      type: mongoose.Types.ObjectId,
      ref: "schedule-cron-action",
      comment: "Gọi hành động khác nếu thành công",
    },
    errorAction: {
      type: mongoose.Types.ObjectId,
      ref: "schedule-cron-action",
      comment: "Gọi hành động khác nếu xãy ra lỗi",
    },
    saveHistory: { type: Boolean, comment: "Cho phép lưu lịch sử hành động", default: false },
    active: { type: Boolean, default: true },
  },
  { timestamps: true, versionKey: false, collection: collectionName }
);
