import { createModule } from "../../utils/module";
import { hrDepartmentSchema } from "./models/department";
import { hrEmployeeSchema } from "./models/employee";
import { hrJobPositionSchema } from "./models/job-position";

createModule({
  module: {
    id: "hr",
    filename: __filename,
    name: "Human Resource (HR)",
    version: "1.0",
    description: "Module quản lý nhân sự.",
    author: "Anh Khoa",
    depends: [],
    datas: [
      {
        primaryKey: "id",
        modelName: "menu",
        folder: "hr",
        file: "base.menu.csv",
        noUpdate: false,
      },
    ],
    installable: false,
    application: true,
  },
  models: [
    {
      name: "Employee",
      modelName: "hr-employee",
      schema: hrEmployeeSchema,
    },
    {
      name: "Department",
      modelName: "hr-department",
      schema: hrDepartmentSchema,
    },
    {
      name: "Job Position",
      modelName: "hr-job-position",
      schema: hrJobPositionSchema,
    },
  ],
});
