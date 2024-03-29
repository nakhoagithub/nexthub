import { createModule } from "../../utils/tool";
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

createModule({
  module: {
    id: "base",
    name: "Base",
    version: "1.0",
    description: "Base",
    author: "Anh Khoa",
    depends: [],
    state: "base",
    datas: [
      {
        model: "access",
        folder: "base",
        file: "base.access.csv",
        primaryKey: "id",
      },
      {
        model: "group",
        folder: "base",
        file: "base.group.csv",
        primaryKey: "id",
      },
      {
        model: "menu",
        folder: "base",
        file: "base.menu.csv",
        primaryKey: "id",
      },
      {
        model: "language",
        folder: "base",
        file: "base.language.csv",
        primaryKey: "id",
        noUpdate: true,
      },
      {
        model: "translate-term",
        folder: "base",
        file: "base.translate.term.csv",
        primaryKey: "sourceTerm",
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
  ],
});
