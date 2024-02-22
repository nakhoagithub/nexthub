import mongoose from "mongoose";
import { logger } from "../../../utils/logger";
import moment from "moment";

const collectionName = "farm.period.planting.schedule.detail";

export const periodPlantingScheduleDetailSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    idPlantingSchedule: { type: mongoose.Types.ObjectId, ref: "planting-schedule" },
    idPlantingScheduleDetail: { type: mongoose.Types.ObjectId, ref: "planting-schedule-detail" },
    idSamplePeriodPlantingSchedule: { type: mongoose.Types.ObjectId, ref: "sample-period-planting-schedule" },
    sortIndex: { type: Number, required: true },
    numOfDays: { type: Number, required: true },
    isStart: { type: Boolean, default: false },
    dateStart: { type: Number, comment: "Ngày bắt đầu giai đoạn" },
    dateEnd: { type: Number, comment: "Ngày kết thúc giai đoạn" },
  },
  { timestamps: true, versionKey: false, collection: collectionName }
);

// async function customPeriodPlantingScheduleDetailSchema(this: any, doc: any, next: any, type: "save" | "update") {
//   try {
//     const PPSD = mongoose.model("period-planting-schedule-detail");

//     // cập nhật lại ngày kết thúc của period hiện tại
//     // và tất cả ngày của các period sau

//     const periodData = await PPSD.findOne({ _id: doc._id });
//     const periods = await PPSD.find({ idPlantingSchedule: periodData?.idPlantingSchedule }).sort("sortIndex");

//     let dateStartPeriod = doc.dateEnd + 86400;
//     for (let i = 0; i < periods.length; i++) {
//       if (periodData.sortIndex < periods[i].sortIndex) {
//         let numOfDays = periods[i].numOfDays ?? 1;
//         let dateEndPeriod = dateStartPeriod + numOfDays * 86400 - 86400;

//         await PPSD.updateOne(
//           {
//             _id: periods[i]._id,
//           },
//           { dateStart: dateStartPeriod, dateEnd: dateEndPeriod },
//           { upsert: true }
//         );

//         dateStartPeriod = dateEndPeriod + 86400;
//       }
//     }
//     next();
//   } catch (error) {
//     next(Error(error?.toString() ?? "Error"));
//     logger({ message: error, name: `customPeriodPlantingScheduleDetailSchema: ${error}` });
//   }
// }

// periodPlantingScheduleDetailSchema.pre("updateOne", async function (next) {
//   const updateData = (this as any)._update;
//   await customPeriodPlantingScheduleDetailSchema.call(this, updateData, next, "update");
// });

let isUpdating = false;

async function updatePeriod(this: any, doc: any, next: any, type: "save" | "update") {
  try {
    const PPSD = mongoose.model("period-planting-schedule-detail");
    // check update để không bị gọi đệ quy lại lần nữa
    if (!isUpdating) {
      isUpdating = true;
      const periodData = await PPSD.findOne({ _id: doc.$set?._id });
      const periodsPSD = await PPSD.find({ idPlantingSchedule: periodData?.idPlantingSchedule }).sort("sortIndex");

      if (periodsPSD.length > 0) {
        let dateStart = periodsPSD[0].dateStart;
        for (var period of periodsPSD) {
          let numOfDays = period.numOfDays ?? 1;
          let dateEnd = dateStart + numOfDays * 86400 - 86400;

          await PPSD.updateOne(
            {
              _id: period._id,
            },
            { dateStart: dateStart, dateEnd: dateEnd },
            { upsert: true }
          );

          dateStart = dateEnd + 86400;
        }
      }

      const periods = await PPSD.find({ idPlantingSchedule: periodData?.idPlantingSchedule }).sort("sortIndex");

      const PS = mongoose.model("planting-schedule");
      for (let i = 0; i < periods.length; i++) {
        if (periods[i].isStart === true) {
          await PS.findByIdAndUpdate(
            { _id: periodData?.idPlantingSchedule },
            { seedingDate: periods[i].dateStart, year: moment.unix(periodsPSD[i].dateStart ?? 0).year() }
          );
        }

        if (i + 1 == periods.length) {
          await PS.findByIdAndUpdate({ _id: periodData?.idPlantingSchedule }, { harvestDate: periods[i].dateEnd });
        }
      }

      isUpdating = false;
    }

    next();
  } catch (error) {
    next(Error(error?.toString() ?? "Error"));
    logger({ message: error, name: `updatePeriod: ${error}` });
  }
}

periodPlantingScheduleDetailSchema.post("updateOne", async function (doc, next) {
  const updateData = (this as any)._update;
  await updatePeriod.call(this, updateData, next, "update");
});
