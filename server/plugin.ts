import express from "express";
import { ModuleInterface } from "interfaces/module";
import mongoose from "mongoose";

const router = express.Router();
router.use("/api", router);

let modules: ModuleInterface[] = [];

const plugin = {
  router: router,
  databaseAttachment: mongoose.createConnection(),
  modules: modules,
};

export default plugin;
