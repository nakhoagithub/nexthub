import * as fs from "fs";
import * as path from "path";

const modelsPath = path.join(__dirname, "modules", "models");
// // Hàm để tìm các tệp index.ts trong thư mục và chạy hàm từ đó
// function findAndRunIndexFiles(directory: string) {
//   const files = fs.readdirSync(directory);

//   files.forEach((file) => {
//     const filePath = path.join(directory, file);

//     if (fs.statSync(filePath).isDirectory()) {
//       // Nếu là thư mục, tiếp tục đệ quy vào thư mục con
//       findAndRunIndexFiles(filePath);
//     } else if (file === "index.ts") {
//       // Nếu là tệp index.ts, chạy hàm từ tệp đó
//       const module = findFileAndExportDefault<any>(filePath);

//       if (module && typeof module.run === "function") {
//         module.run();
//       }
//     }
//   });
// }
