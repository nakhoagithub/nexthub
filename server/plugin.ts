import express from "express";
import mongoose from "mongoose";

const router = express.Router();
router.use("/api", router);

const plugin = { router: router, databaseAttachment: mongoose.createConnection() };

export default plugin;
