import plugin from "../../plugin";
import { Request, Response } from "express";

/**
 * API / check trạng thái server
 */
plugin.router.get("/", async (req: Request, res: Response) => {
  return res.status(200).json({ code: 200, message: "Power by Anh Khoa" });
});
