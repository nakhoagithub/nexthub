import checkAuth from "../middlewares/auth";
import plugin from "../../plugin";
import { logger } from "../../utils/logger";
import mongoose from "mongoose";

plugin.router.get("/language/get", checkAuth, async (req, res) => {
  try {
    const { modelName } = req.query;
    const TranslateTerm = mongoose.model("translate-term");
    const user = (req as any).user;
    let filterTranslateTerm: any = {
      localeCode: user.localeCode,
      active: true,
      $or: [{ modelName: "" }, { modelName: null }, { modelName: undefined }],
    };

    if (modelName && modelName != "") {
      delete filterTranslateTerm.$or;
      filterTranslateTerm = { ...filterTranslateTerm, modelName };
    }

    const translateTerm = await TranslateTerm.find(filterTranslateTerm);
    return res.status(200).json({ code: 200, datas: translateTerm });
  } catch (error) {
    logger({ message: error, name: "API: /api/language/get" });
    return res.status(500).json({ code: 500, error: error });
  }
});
