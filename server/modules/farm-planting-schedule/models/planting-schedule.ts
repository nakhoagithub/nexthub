import mongoose from "mongoose";
import { logger } from "../../../utils/logger";
import moment from "moment";

const collectionName = "farm.planting.schedule";

export const plantingScheduleSchema = new mongoose.Schema(
  {
    code: { type: String },
    idFarm: { type: mongoose.Types.ObjectId, ref: "farm" },
    idArea: { type: mongoose.Types.ObjectId, ref: "area" },
    idBreed: { type: mongoose.Types.ObjectId, ref: "breed" },
    numberOfSeasons: { type: Number, comment: "Số mùa vụ" },
    idSamplePlantingSchedule: { type: mongoose.Types.ObjectId, ref: "sample-planting-schedule" },
    seedingDate: { type: Number, comment: "Ngày ươm" },
    harvestDate: { type: Number, comment: "Ngày thu hoạch" },
    year: { type: Number, comment: "Năm" },
    dateStartPlanting: { type: Number, comment: "Ngày bắt đầu" },
    dateEndPlanting: { type: Number, comment: "Ngày kết thúc" },
    dateStartProductionDocument: { type: Number, comment: "Ngày bắt đầu nhập hồ sơ sản xuất" },
    dateEndProductionDocument: { type: Number, comment: "Ngày kết thúc nhập hồ sơ sản xuất" },
    actualNumberOfPlants: { type: Number, comment: "Số cây trồng thực tế", default: 0 }, // số cây trồng thực thế
    totalOfPlants: { type: Number, comment: "Tổng số cây trồng", default: 0 },
    quantity: { type: Number, comment: "Sản lượng thực tế", default: 0 },
    quantityExpected: { type: Number, comment: "Sản lượng dự kiến", default: 0 },
    status: { type: String, comment: "Trạng thái lịch trình", default: "create" },
    comment: { type: String, default: "" },
  },
  { timestamps: true, versionKey: false, collection: collectionName }
);

async function customPlantingSchedule(this: any, doc: any, next: any, type: "save" | "update") {
  try {
    // viết tắt
    // PS = PlantingSchedule
    // PSD = PlantingScheduleDetail
    // PPS = PeriodPlantingSchedule
    // PPSD = PeriodPlantingScheduleDetail
    // SPS = SamplePlantingSchedule
    // SPPS = SamplePeriodPlantingSchedule

    const Area = mongoose.model("area");
    const PS = mongoose.model("planting-schedule");
    const PSD = mongoose.model("planting-schedule-detail");
    const PPSD = mongoose.model("period-planting-schedule-detail");
    const SPS = mongoose.model("sample-planting-schedule");
    const SPPS = mongoose.model("sample-period-planting-schedule");
    const ProductionDocument = mongoose.model("production-document");

    // kiểm tra lịch trình tồn tại thông qua `code`
    const plantingSchedule = await PS.findOne({ code: doc?.code });
    if (type === "save" && plantingSchedule) {
      return next(Error("Lịch trình này đã tồn tại"));
    }

    // thêm idFarm
    const area = await Area.findOne({ _id: doc?.idArea });
    const idFarm = area?.idFarm;
    this.idFarm = idFarm;

    // số cây trồng thực tế
    const actualNumberOfPlants = this.actualNumberOfPlants ?? 0;

    // tìm mẫu lịch trình
    const samplePlantingSchedule = await SPS.findOne({
      _id: doc?.idSamplePlantingSchedule,
      active: true,
    });
    // sản lượng trung bình cây/trái
    const averageYield = samplePlantingSchedule?.averageYield ?? 0;

    // thời gian phát sinh
    const numOfDaysIncurred = samplePlantingSchedule?.numOfDaysIncurred ?? 0;

    // tính sản lượng dự kiến = 80% * sản lượng trung bình * số cây trồng thực tế
    this.quantityExpected = 0.8 * averageYield * actualNumberOfPlants;

    // tìm giai đoạn của mẫu lịch trình để tạo ra giao đoạn của lịch trình
    // giai đoạn của mẫu
    const samplePeriods = await SPPS.find({
      idSamplePlantingSchedule: samplePlantingSchedule?._id,
      active: true,
    }).sort("sortIndex");

    // nếu mẫu không có giai đoạn thì không được tạo lịch trình
    if (samplePeriods.length == 0) {
      return next(Error("Mẫu lịch trình này không có giai đoạn"));
    }

    // tạo planting schedule detail
    let newSamplePlantingSchedule = { ...{ ...samplePlantingSchedule }._doc };
    delete newSamplePlantingSchedule._id;
    await PSD.updateOne({ idPlantingSchedule: doc._id }, { ...newSamplePlantingSchedule }, { upsert: true });

    // tìm lại planting schedule detail để lấy _id
    let plantingScheduleDetail = await PSD.findOne({ idPlantingSchedule: doc._id });

    // ngày bắt đầu của kế hoạch
    let dateStartPS = doc.dateStartPlanting;

    // index ngày bắt đầu
    let indexDateStart = 0;

    // tạo giai đoạn cho lịch sản xuất từ các giai đoạn của mẫu
    for (let i = 0; i < samplePeriods.length; i++) {
      if (samplePeriods[i].isStart === true) {
        indexDateStart = i;
      }

      let newSamplePeriod: any = { ...{ ...samplePeriods[i] }._doc };
      delete newSamplePeriod._id;
      newSamplePeriod.idPlantingSchedule = doc._id;
      newSamplePeriod.idPlantingScheduleDetail = plantingScheduleDetail._id;

      await PPSD.updateOne(
        {
          idPlantingSchedule: doc?._id,
          idPlantingScheduleDetail: plantingScheduleDetail._id,
          idSamplePeriodPlantingSchedule: samplePeriods[i]._id,
        },
        { ...newSamplePeriod },
        { upsert: true }
      );
    }

    // cập nhật thời gian lại cho các giai đoạn
    let dateStartPeriod = dateStartPS;
    for (let i = indexDateStart - 1; i >= 0; i--) {
      let numOfDays = samplePeriods[i].numOfDays ?? 1;
      let dateEndPeriod = dateStartPeriod - 86400;
      dateStartPeriod = dateEndPeriod - numOfDays * 86400 + 86400;

      await PPSD.updateOne(
        {
          idPlantingSchedule: doc?._id,
          idPlantingScheduleDetail: plantingScheduleDetail._id,
          idSamplePeriodPlantingSchedule: samplePeriods[i]._id,
        },
        { dateStart: dateStartPeriod, dateEnd: dateEndPeriod },
        { upsert: true }
      );
    }

    dateStartPeriod = dateStartPS;
    for (let i = indexDateStart; i < samplePeriods.length; i++) {
      let numOfDays = samplePeriods[i].numOfDays ?? 1;
      let dateEndPeriod = dateStartPeriod + numOfDays * 86400 - 86400;
      await PPSD.updateOne(
        {
          idPlantingSchedule: doc?._id,
          idPlantingScheduleDetail: plantingScheduleDetail._id,
          idSamplePeriodPlantingSchedule: samplePeriods[i]._id,
        },
        { dateStart: dateStartPeriod, dateEnd: dateEndPeriod },
        { upsert: true }
      );

      dateStartPeriod = dateEndPeriod + 86400;
    }

    // cập nhật ngày ươm hạt là ngày bắt đầu của giai đoạn có isStart === true
    const periodsPSD = await PPSD.find({ idPlantingSchedule: doc._id }).sort("sortIndex");
    for (let i = 0; i < periodsPSD.length; i++) {
      if (periodsPSD[i].isStart === true) {
        this.seedingDate = periodsPSD[i].dateStart;
        this.year = moment.unix(periodsPSD[i].dateStart ?? 0).year();
      }

      if (i + 1 == periodsPSD.length) {
        this.harvestDate = periodsPSD[i].dateEnd;
      }
    }

    // tạo hồ sơ sản xuất
    let dateStartProductionDocument = doc.dateStartProductionDocument;
    let dateEndProductionDocument = doc.dateEndProductionDocument;

    if (
      typeof dateEndProductionDocument == "number" &&
      typeof dateStartProductionDocument == "number" &&
      dateEndProductionDocument < dateStartProductionDocument
    ) {
      return next(Error("Ngày nhập hồ sơ sản xuất không hợp lệ!"));
    }

    // nếu không có truyền vào ngày bắt đầu và ngày kết thúc thì set ngày tự động theo mẫu
    // Ngày bắt đầu: ngày bắt đầu theo mẫu - số ngày phát sinh
    // -> ví dụ: ngày bắt đầu là 20/02/2024, ngày phát sinh (mẫu lịch trình): 5 ngày
    // => ngày bắt đầu hồ sơ sản xuất là: 16/02/2024 + 5 => 20/02/2024 (tính ngày 16 là 1 ngày)

    // ngày kết thúc: là ngày kết thúc của kế hoạch
    if (!dateStartProductionDocument && !dateEndProductionDocument) {
      let numOfSecondsIncurred = numOfDaysIncurred * 86400;
      const periodsPSD = await PPSD.find({ idPlantingSchedule: doc._id }).sort("sortIndex");

      if (periodsPSD.length > 0) {
        if (!periodsPSD[0].dateStart || !periodsPSD[periodsPSD.length - 1]) {
          return next(Error("Giai đoạn không hợp lệ!"));
        }
        // dateStartProductionDocument
        let dateSPD = (periodsPSD[0].dateStart ?? 0) - numOfSecondsIncurred;
        // dateEndProductionDocument
        let dateEPD = periodsPSD[periodsPSD.length - 1].dateEnd;

        this.dateStartProductionDocument = dateSPD;
        this.dateEndProductionDocument = dateEPD;
      }
    }

    // tạo production document (hồ sơ sản xuất)
    if (this.dateStartProductionDocument && this.dateEndProductionDocument) {
      let dateSPD = this.dateStartProductionDocument;
      let dateEPD = this.dateEndProductionDocument;
      for (var iDate = dateSPD; iDate <= dateEPD; iDate += 86400) {
        let dateMoment = moment.unix(iDate);
        let newProductionDocument = {
          day: dateMoment.date(),
          month: dateMoment.month() + 1,
          year: dateMoment.year(),
          dateUnix: iDate,
          idArea: doc.idArea,
          idPlantingSchedule: doc._id,
          codePlantingSchedule: doc.code,
          contentWorkDiary: "",
          contentGardenCheckDiary: "",
          contentDiseaseManagement: "",
        };
        await ProductionDocument.updateOne(
          { dateUnix: newProductionDocument.dateUnix, idPlantingSchedule: newProductionDocument.idPlantingSchedule },
          newProductionDocument,
          { upsert: true }
        );
      }

      // xóa những production document (hồ sơ sản xuất) có thời gian khác thời gian của lịch vụ
      await ProductionDocument.deleteMany({
        idPlantingSchedule: doc._id,
        $or: [{ dateUnix: { $gt: dateEPD } }, { dateUnix: { $lt: dateSPD } }],
      });
    }

    next();
  } catch (error) {
    logger({ message: error, name: "customPlantingSchedule" });
    return next(Error(`${error}`));
  }
}

plantingScheduleSchema.pre("save", async function (next) {
  let newDoc: any = this;
  await customPlantingSchedule.call(this, newDoc, next, "save");
});

plantingScheduleSchema.pre("updateOne", async function (next) {
  const updateData = (this as any)._update;
  await customPlantingSchedule.call(updateData, updateData, next, "update");
});

plantingScheduleSchema.pre("deleteMany", { query: true }, async function (next) {
  try {
    const PlantingScheduleDetail = mongoose.model("planting-schedule-detail");
    const PeriodPlantingScheduleDetail = mongoose.model("period-planting-schedule-detail");
    const ProductionDocument = mongoose.model("production-document");
    let query: any = this.getFilter();
    let ids = query?._id?.["$in"];
    if (Array.isArray(ids)) {
      for (var id of ids) {
        await PlantingScheduleDetail.deleteMany({ idPlantingSchedule: id });
        await PeriodPlantingScheduleDetail.deleteMany({ idPlantingSchedule: id });
        await ProductionDocument.deleteMany({ idPlantingSchedule: id });
      }
    }

    next();
  } catch (error) {
    logger({ message: error, name: "plantingScheduleSchema.pre" });
  }
});
