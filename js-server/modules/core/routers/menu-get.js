import plugin from "../../../plugin.js";
import logger from "../../../utils/logger.js";
import checkAuth from "../../../middlewares/auth.js";
import { Group } from "../models/group.js";
import { Menu } from "../models/menu.js";

plugin.router.get("/menu/get", checkAuth, async (req, res) => {
  try {
    const user = req.user;

    if (user?.state === "master") {
      const menus = await Menu.find({ active: true });
      return res.status(200).json({ code: 200, datas: menus });
    }

    const groupsUser = await Group.find({ idsUser: { $in: user?._id } });

    let menus = [];
    for (var group of groupsUser) {
      const menusData = await Menu.find({ _id: { $in: group.idsMenu }, active: true });
      for (var menu of menusData) {
        if (!menus.find((e) => e._id.toHexString() == menu._id.toHexString())) {
          menus.push(menu);
        }
      }
    }

    return res.status(200).json({ code: 200, datas: menus });
  } catch (error) {
    logger(error, `Get menu`);
    return res.status(500).json({ code: 500, error: error });
  }
});
