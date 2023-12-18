import "./routers/user-admin-create.js";
import "./routers/login.js";
import "./routers/auth.js";
import "./routers/change-password.js";
import "./routers/update-current-org.js";
import "./routers/logout.js";
import { User } from "./models/user.js";
import { createModule } from "../../utils/module.js";

User();

await createModule("user", {
  id: "user",
  name: "User",
  description: "Module người dùng",
  folderName: "user",
  models: ["user"],
  state: "base",
  install: true,
  datas: [],
});
