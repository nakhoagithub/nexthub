import mongoose, { CallbackWithoutResultAndOptionalError } from "mongoose";
import { logger } from "../../../utils/logger";

const name = "sample-planting-schedule";

const collectionName = "farm.sample.planting.schedule";

export const samplePlantingScheduleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    idBreed: { type: mongoose.Types.ObjectId, ref: "breed" },
    description: { type: String },
    numOfDaysIncurred: { type: Number },
    averageYield: { type: Number },
    idsPeriod: { type: [mongoose.Types.ObjectId] },
    active: { type: Boolean, default: true },
  },
  { timestamps: true, versionKey: false, collection: collectionName }
);

samplePlantingScheduleSchema.pre("deleteMany", { query: true }, async function (next) {
  try {
    const SamplePeriod = mongoose.model("sample-period-planting-schedule");
    const Sample = mongoose.model("sample-planting-schedule");
    let query: any = this.getFilter();
    let ids = query?._id?.["$in"];
    let errors = [];
    if (Array.isArray(ids)) {
      for (var id of ids) {
        const data = await SamplePeriod.findOne({ idSamplePlantingSchedule: id });
        if (data) {
          const sample = await Sample.findOne({ _id: id });
          errors.push(sample?.name);
        } else {
          await Sample.deleteOne({ _id: id });
        }
      }
    }

    if (errors.length > 0) {
      next(Error(`Không thể xóa:\n${errors.map((e) => `- ${e}`).join("\n")}\nĐang được sử dụng bởi các giai đoạn mẫu`));
    }
  } catch (error) {
    logger({ message: error, name: "samplePlantingScheduleSchema.pre" });
  }
  // const datas = await SamplePeriod.find({ idSamplePlantingSchedule: res._id });
  // console.log(datas);
});
