import { createModule } from "../../utils/tool";
import { accessSchema } from "./models/access";
import { documentAccessSchema } from "./models/document-access";
import { groupSchema } from "./models/group";
import { modelSchema } from "./models/model";
import { moduleSchema } from "./models/module";
import { schemaSchema } from "./models/schema";
import { userSchema } from "./models/user";

createModule({
  module: {
    id: "base",
    name: "Base",
    version: "1.0",
    description: "Base",
    author: "Anh Khoa",
    depends: [],
    datas: [],
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
      name: "User",
      modelName: "user",
      schema: userSchema,
    },
  ],
});
