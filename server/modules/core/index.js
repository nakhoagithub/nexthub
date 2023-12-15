import "./routers/menu-get.js";
import "./routers/model-info-get.js";
import "./routers/model-get.js";
import "./routers/model-create.js";
import "./routers/model-update.js";
import "./routers/model-update-array.js";
import "./routers/model-delete.js";
import "./routers/model-install.js";
import "./routers/model-access.js";
import { Group } from "./models/group.js";
import { Access } from "./models/access.js";
import { Model } from "./models/model.js";
import { Schema } from "./models/schema.js";
import { DocumentAccess } from "./models/document-access.js";
import { Menu } from "./models/menu.js";

import { createModule } from "../../utils/module.js";

Group();
Access();
DocumentAccess();
Model();
Schema();
Menu();

await createModule("core", {
  id: "core",
  name: "Core",
  models: ["group", "access", "document-access", "model", "schema", "menu"],
  state: "base",
  folderName: "core",
  datas: [
    {
      model: "access",
      folder: "core",
      file: "base.access.csv",
      primaryKey: "id",
    },
    {
      model: "group",
      folder: "core",
      file: "base.group.csv",
      primaryKey: "id",
    },
    {
      model: "menu",
      folder: "core",
      file: "base.menu.csv",
      primaryKey: "id",
    },
    // {
    //   model: "document-access",
    //   folder: "core",
    //   file: "base.document.access.csv",
    //   primaryKey: "id",
    // },
  ],
});
