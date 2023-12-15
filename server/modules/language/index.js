import "./routers/get-language.js";
import { Language } from "./models/language.js";
import { TranslateTerm } from "./models/translate-term.js";
import { createModule } from "../../utils/module.js";

Language();
TranslateTerm();

await createModule("language", {
  id: "language",
  folderName: "language",
  models: ["language", "translate-term"],
  name: "Language",
  state: "base",
  datas: [
    {
      primaryKey: "id",
      file: "base.language.csv",
      folder: "language",
      model: "language",
    },
    {
      primaryKey: "sourceTerm",
      file: "base.translate.term.csv",
      folder: "language",
      model: "translate-term",
    },
  ],
});
