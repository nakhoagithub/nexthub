import express from "express";
import "./modules/index.js";

const router = express.Router();
router.use("/api", router);

export default {
  router,
};
