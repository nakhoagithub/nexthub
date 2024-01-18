import mongoose from "mongoose";
import plugin from "../../plugin";
import { logger } from "../../utils/logger";
import checkAuth from "../middlewares/auth";

async function getParent(menus: any[], results: any[]) {
  const Menu = mongoose.model("menu");
  for (var menu of menus) {
    if (!results.find((e: any) => e.id === menu["id"])) {
      results.push(menu);
    }
    if (menu["idParent"] && typeof menu["idParent"] === "string" && menu["idParent"].length > 0) {
      const menusParent = await Menu.find({ id: menu["idParent"] });
      for (var menuParent of menusParent) {
        if (!results.find((e: any) => e.id === menuParent["id"])) {
          results.push(menuParent);
        }
      }
      await getParent(menusParent, results);
    }
    if (!menu["idParent"] || (typeof menu["idParent"] === "string" && menu["idParent"].length === 0)) {
      if (!results.find((e: any) => e.id === menu["id"])) {
        results.push(menu);
      }
    }
  }
  return results;
}

plugin.router.get("/menu/get", checkAuth, async (req, res) => {
  try {
    const Menu = mongoose.model("menu");
    const Group = mongoose.model("group");
    const user = (req as any).user;

    if (user?.state === "master") {
      const menus = await Menu.find({ active: true });
      return res.status(200).json({ code: 200, datas: menus });
    }

    const groupsUser = await Group.find({ idsUser: { $in: user?._id } });

    let menus: any[] = [];
    for (var group of groupsUser) {
      const menusData = await Menu.find({ _id: { $in: group.idsMenu }, active: true });
      for (var menu of menusData) {
        if (!menus.find((e) => e._id.toHexString() == menu._id.toHexString())) {
          menus.push(menu);
        }
      }
    }

    let newMenus: any[] = [];
    await getParent(menus, newMenus);

    return res.status(200).json({ code: 200, datas: newMenus });
  } catch (error) {
    logger({ message: error, name: `API: /menu/get` });
    return res.status(500).json({ code: 500, error: error });
  }
});
