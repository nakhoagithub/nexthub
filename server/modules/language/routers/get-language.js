import checkAuth from "../../../middlewares/auth.js";
import plugin from "../../../plugin.js";
import logger from "../../../utils/logger.js";
import { Language } from "../models/language.js";
import { TranslateTerm } from "../models/translate-term.js";

plugin.router.get("/language/get", checkAuth, async (req, res) => {
  try {
    const { modelName } = req.query;
    const user = req.user;
    let filterTranslateTerm = { localeCode: user.localeCode, active: true, modelName: "" };
    if (modelName) {
      filterTranslateTerm = { ...filterTranslateTerm, modelName };
    }

    const translateTerm = await TranslateTerm.find(filterTranslateTerm);
    return res.status(200).json({ code: 200, datas: translateTerm });
  } catch (error) {
    logger(error, "API: /api/language/get");
    return res.status(500).json({ code: 500, error: error });
  }
});
