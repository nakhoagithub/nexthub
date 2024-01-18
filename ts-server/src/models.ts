// import * as fs from "fs";
// import * as path from "path";
// import { logger } from "../utils/logger";
// import { Manifest } from "interfaces/manifest";

// const modulesPath = path.join("./", "modules");

// export class BaseModel {
//   constructor() {
//     this.id = BaseModel.getNextId();
//     this.createdAt = new Date();
//     this.updatedAt = new Date();
//   }

//   private static nextId = 1;

//   private static getNextId() {
//     return BaseModel.nextId++;
//   }

//   id: number;
//   createdAt: Date;
//   updatedAt: Date;
// }

// export function field(type: string) {
//   return function (target: any, propertyKey: string) {
//     // Lưu thông tin về trường vào một mảng hoặc đối tượng quản lý
//     if (!target.fields) {
//       target.fields = [];
//     }
//     target.fields.push({ name: propertyKey, type });
//   };
// }

// function readManifest(path: string) {
//   try {
//     const content = fs.readFileSync(path, "utf-8");
//     return JSON.parse(content);
//   } catch (error) {
//     logger({ message: error, name: "readManifest" });
//   }
// }

// export function autoCreateModule() {
//   try {
//     const modules = fs.readdirSync(`${modulesPath}`);
//     modules.forEach((module) => {
//       const filePath = path.join(`${modulesPath}/${module}`, "manifest.json");
//       const manifest: Manifest = readManifest(filePath);

//       if (manifest.installable) {
//         console.log(module);
//       }
//     });
//   } catch (error) {
//     logger({ message: error, name: "autoCreateModule" });
//   }
// }
