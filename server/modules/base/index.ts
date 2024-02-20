import { createModule } from "../../utils/module";
import { accessSchema } from "./models/access";
import { documentAccessSchema } from "./models/document-access";
import { groupSchema } from "./models/group";
import { modelSchema } from "./models/model";
import { moduleSchema } from "./models/module";
import { schemaSchema } from "./models/schema";
import { userSchema } from "./models/user";
import { menuSchema } from "./models/menu";
import { languageSchema } from "./models/language";
import { translateTermSchema } from "./models/translate-term";
import { orgSchema } from "./models/org";
import { uomSchema } from "./models/uom";
import { uomCateSchema } from "./models/uom-cate";

createModule({
  module: {
    id: "base",
    filename: __filename,
    name: "Base",
    version: "1.0",
    description: "System module default",
    author: "Anh Khoa",
    depends: [],
    state: "base",
    datas: [
      {
        modelName: "access",
        folder: "base",
        file: "base.access.csv",
        primaryKey: "id",
      },
      {
        modelName: "group",
        folder: "base",
        file: "base.group.csv",
        primaryKey: "id",
      },
      {
        modelName: "menu",
        folder: "base",
        file: "base.menu.csv",
        primaryKey: "id",
      },
      {
        modelName: "language",
        folder: "base",
        file: "base.language.csv",
        primaryKey: "id",
        noUpdate: true,
      },
      {
        modelName: "translate-term",
        folder: "base",
        file: "base.translate.term.csv",
        primaryKey: "sourceTerm",
        noUpdate: true,
      },
      {
        modelName: "uom",
        folder: "base",
        file: "base.uom.csv",
        primaryKey: "id",
        noUpdate: true,
      },
      {
        modelName: "uom-cate",
        folder: "base",
        file: "base.uom.cate.csv",
        primaryKey: "id",
        noUpdate: true,
      },
    ],
    installable: true,
    application: true,
  },
  models: [
    {
      name: "Module",
      modelName: "module",
      schema: moduleSchema,
    },
    {
      name: "Model",
      modelName: "model",
      schema: modelSchema,
    },
    {
      name: "Schema",
      modelName: "schema",
      schema: schemaSchema,
    },
    {
      name: "User",
      modelName: "user",
      schema: userSchema,
    },
    {
      name: "Access",
      modelName: "access",
      schema: accessSchema,
    },
    {
      name: "Group",
      modelName: "group",
      schema: groupSchema,
    },
    {
      name: "Document Access",
      modelName: "document-access",
      schema: documentAccessSchema,
    },
    {
      name: "Menu",
      modelName: "menu",
      schema: menuSchema,
    },
    {
      name: "Language",
      modelName: "language",
      schema: languageSchema,
    },
    {
      name: "Translate Term",
      modelName: "translate-term",
      schema: translateTermSchema,
    },
    {
      name: "Organization",
      modelName: "org",
      schema: orgSchema,
    },
    {
      name: "Unit of measure",
      modelName: "uom",
      schema: uomSchema,
    },
    {
      name: "Unit of Measure Category",
      modelName: "uom-cate",
      schema: uomCateSchema,
    },
  ],
});
