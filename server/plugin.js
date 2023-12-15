import express from "express";
import mongoose from "mongoose";

const router = express.Router();
router.use("/api", router);

/**
 * @type {Plugin}
 * @typedef {{ router: express.Router, databaseAttachment?: mongoose.Connection }} Plugin
 */
const plugin = { router: router, databaseAttachment: undefined };

export default plugin;
