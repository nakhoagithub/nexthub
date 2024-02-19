import { createModule } from "../../utils/module";

createModule({
  module: {
    id: "farm-production-document",
    name: "Farm Production Document",
    version: "1.0",
    description: "Module quản lý hồ sơ sản xuất sản xuất cho nông trại",
    author: "Anh Khoa",
    depends: ["farm", "farm-planting-schedule"],
    datas: [
      {
        primaryKey: "id",
        modelName: "menu",
        folder: "farm-production-document",
        file: "base.menu.csv",
        noUpdate: false,
      },
    ],
    installable: false,
    application: true,
  },
  models: [],
});
