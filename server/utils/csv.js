import logger from "./logger.js";
import csv from "csv-parser";
import fs from "fs";

/**
 *
 * @param {String} folderModule module name
 * @param {String} fileName csv file name
 * @returns {Promise<Array>}
 */
export async function readCSV(folderModule, fileName) {
  try {
    if (!folderModule || !fileName) {
      throw Error("filepath is undefined");
    }
    let filepath = `./server/modules/${folderModule}/data/${fileName}`;
    let results = await fs.createReadStream(filepath).pipe(csv()).toArray();

    let newResults = [];
    for (var result of results) {
      let newObject = {};
      for (var value of Object.entries(result)) {
        if (
          value[1] === "false" ||
          value[1] === "FALSE" ||
          value[1] === "true" ||
          value[1] === "TRUE"
        ) {
          newObject = { ...newObject, [value[0]]: eval(value[1]) };
        } else if (
          value[1] === "null" ||
          value[1] === "NULL" ||
          value[1] === "None" ||
          value[1] === "NONE"
        ) {
          newObject = { ...newObject, [value[0]]: null };
        } else if (!isNaN(parseFloat(value[1]))) {
          newObject = { ...newObject, [value[0]]: parseFloat(value[1]) };
        } else if (!isNaN(parseInt(value[1]))) {
          newObject = { ...newObject, [value[0]]: parseInt(value[1]) };
        } else {
          newObject = { ...newObject, [value[0]]: value[1] };
        }
      }
      newResults.push(newObject);
    }
    return newResults;
  } catch (error) {
    logger(error, "readCSV");
  }
}
