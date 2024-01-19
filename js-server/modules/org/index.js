import { createModule } from "../../utils/module.js";
import { Org } from "./models/org.js";

Org();

await createModule("org", {
  id: "org",
  name: "Organization (org)",
  description: "Module tổ chức (Organization)",
  folderName: "org",
  models: ["org"],
  state: "base",
  install: true,
  datas: [],
});
