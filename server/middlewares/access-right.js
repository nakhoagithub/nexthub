import mongoose from "mongoose";
import { Access } from "../modules/core/models/access.js";
import { Group } from "../modules/core/models/group.js";
import { DocumentAccess } from "../modules/core/models/document-access.js";
import logger from "../utils/logger.js";

const checkAccessRight = async (req, res, next) => {
  try {
    let user = req.user;
    let params = req.params;

    if (!user) {
      return res.status(200).json({ code: 401, message: "Unauthorized" });
    }

    if (!mongoose.modelNames().includes(params.name)) {
      return res.status(200).json({ code: 400, message: "Model not found" });
    }

    // handler document access
    let queryDocumentAccess = { modelName: params.name, active: true };

    if (req.method === "GET") {
      queryDocumentAccess = { ...queryDocumentAccess, apply_for_read: true };
    }
    if (req.method === "POST") {
      queryDocumentAccess = { ...queryDocumentAccess, apply_for_create: true };
    }
    if (req.method === "PUT") {
      queryDocumentAccess = { ...queryDocumentAccess, apply_for_update: true };
    }
    if (req.method === "PATCH") {
      queryDocumentAccess = { ...queryDocumentAccess, apply_for_update: true };
    }
    if (req.method === "DELETE") {
      queryDocumentAccess = { ...queryDocumentAccess, apply_for_delete: true };
    }
    const documentAccess = await DocumentAccess.find(queryDocumentAccess);

    let filter = { $or: [] };
    for (const documentAccessData of documentAccess) {
      if (documentAccessData.filter) {
        filter.$or.push({ ...JSON.parse(documentAccessData.filter) });
      }
    }

    if (filter.$or.length === 0) {
      req.allowFilter = {};
    } else {
      req.allowFilter = filter;
    }

    // handler access
    let queryAccess = { modelName: params.name, active: true };
    if (req.method === "GET") {
      queryAccess = { ...queryAccess, read: true };
    }
    if (req.method === "POST") {
      queryAccess = { ...queryAccess, create: true };
    }
    if (req.method === "PUT") {
      queryAccess = { ...queryAccess, update: true };
    }
    if (req.method === "PATCH") {
      queryAccess = { ...queryAccess, update: true };
    }
    if (req.method === "DELETE") {
      queryAccess = { ...queryAccess, delete: true };
    }

    const access = await Access.find(queryAccess);

    let accessModel = { read: true, create: true, update: true, delete: true };
    for (var accessData of access) {
      if (accessData.read === false) {
        accessModel.read = false;
      }
      if (accessData.create === false) {
        accessModel.create = false;
      }
      if (accessData.update === false) {
        accessModel.update = false;
      }
      if (accessData.delete === false) {
        accessModel.delete = false;
      }
    }

    req.accessModel = accessModel;

    // master user
    if (user.state === "master") {
      return next();
    }

    if (documentAccess.length === 0 && access.length === 0) {
      return res.status(200).json({ code: 403, message: "Access is not allowed (access)" });
    }

    // handler groups
    const groups = await Group.find({
      $or: [
        { idsAccess: { $in: access.map((e) => e._id) } },
        { idsDocumentAccess: { $in: documentAccess.map((e) => e._id) } },
      ],
      idsUser: { $in: [user._id] },
    });

    if (groups.length === 0) {
      return res.status(200).json({ code: 403, message: "Access is not allowed (group)" });
    }

    return next();
  } catch (error) {
    logger(error, "checkAccessRight");
    return res.status(500).json({ code: 500, message: "Internal Server Error" });
  }
};

export default checkAccessRight;
