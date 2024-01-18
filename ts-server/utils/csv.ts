import { logger } from "./logger";
import csv from "csv-parser";
import fs from "fs";

export async function readCSV(folderModule: string, fileName: string) {
  try {
    if (!folderModule || !fileName) {
      throw Error("filepath is undefined");
    }
    let filepath = `./modules/${folderModule}/data/${fileName}`;
    let results = await fs.createReadStream(filepath).pipe(csv()).toArray();

    let newResults: any[] = [];
    for (var result of results) {
      let newObject = {};
      for (var value of Object.entries(result)) {
        if (value[1] === "false" || value[1] === "FALSE" || value[1] === "true" || value[1] === "TRUE") {
          newObject = { ...newObject, [value[0]]: eval(value[1]) };
        } else if (value[1] === "null" || value[1] === "NULL" || value[1] === "None" || value[1] === "NONE") {
          newObject = { ...newObject, [value[0]]: null };
        } else if (typeof value[1] == "string" && !isNaN(parseFloat(value[1]))) {
          newObject = { ...newObject, [value[0]]: parseFloat(value[1]) };
        } else if (typeof value[1] == "string" && !isNaN(parseInt(value[1]))) {
          newObject = { ...newObject, [value[0]]: parseInt(value[1]) };
        } else {
          newObject = { ...newObject, [value[0]]: value[1] };
        }
      }
      newResults.push(newObject);
    }
    return newResults;
  } catch (error) {
    logger({ message: error, name: "readCSV" });
  }
}
