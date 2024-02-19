import mongoose from "mongoose";

export interface Model {
  name: string;
  modelName: string;
  schema: mongoose.Schema;
}

export interface Data {
  modelName: string;
  folder: string;
  file: string;
  primaryKey: string;
  modelDescription?: String;
  noUpdate?: boolean;
}

export interface ModuleInterface {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  /** Danh sách các `id: string` của các module phụ thuộc */
  depends: string[];
  datas: Data[];
  installable: boolean;
  application: boolean;
  state?: "base" | "normal";
}
