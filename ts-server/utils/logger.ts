import fs from "fs";
import moment from "moment";

export function logger({ message, name }: { message: any; name?: string }) {
  try {
    let newName = "";
    if (name !== undefined) {
      newName = name;
    }
    const logFileName = "./server.log";
    const timestamp = moment().format("DD-MM-YYYY HH:mm:ss");
    const logEntry = `[${newName}] ${timestamp}: ${message}\n`;
    fs.appendFile(logFileName, logEntry, (err) => {
      if (err) {
        console.error(`Không thể ghi log lỗi vào ${logFileName}: ${err}`);
      }
    });
  } catch (error) {}
}
