import { Access } from "../modules/core/models/access.js";
import { Group } from "../modules/core/models/group.js";
import logger from "../utils/logger.js";

const checkAccessInstall = async (req, res, next) => {
  try {
    let user = req.user;

    if (!user) {
      return res.status(200).json({ code: 401, message: "Unauthorized" });
    }

    if (user.state === "master") {
      return next();
    }

    let queryAccess = { modelName: "model", update: true };
    const access = await Access.find(queryAccess);

    const groups = await Group.find({
      $or: [{ idsAccess: { $in: access.map((e) => e._id) } }],
      idsUser: { $in: [user._id] },
    });

    if (groups.length === 0) {
      return res.status(200).json({ code: 403, message: "Access is not allowed" });
    }

    return next();
  } catch (error) {
    logger(error, "checkAccessInstall");
  }
};

export default checkAccessInstall;
