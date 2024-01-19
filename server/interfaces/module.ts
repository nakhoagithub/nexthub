import mongoose from "mongoose";

export interface Model {
  name: string;
  modelName: string;
  schema: mongoose.Schema;
}

export interface Data {
  model: string;
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
  depends: [];
  datas: Data[];
  installable: boolean;
  application: boolean;
  state?: "base" | "normal";
}
