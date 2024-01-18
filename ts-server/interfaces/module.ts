import mongoose from "mongoose";

export interface Model {
  name: string;
  modelName: string;
  schema: mongoose.Schema;
}

export interface ModuleInterface {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  depends: [];
  datas: string[];
  installable: boolean;
  application: boolean;
}
