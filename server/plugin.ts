import express from "express";
import { Crobjob } from "interfaces/cronjob";
import { ModuleInterface } from "interfaces/module";
import mongoose from "mongoose";

const router = express.Router();
router.use("/api", router);

let modules: ModuleInterface[] = [];
let cronjobs: Crobjob[] = [];

const plugin = {
  router: router,
  databaseAttachment: mongoose.createConnection(),
  modules: modules,
  cronjobs: cronjobs,
};

export default plugin;
