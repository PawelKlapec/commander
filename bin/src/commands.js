import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Table } from "console-table-printer";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const data = JSON.parse(fs.readFileSync(dirname + "/commands.json"));
const table = new Table({
  columns: [
    { name: "index", alignment: "center" },
    { name: "description", alignment: "left" },
    { name: "command", alignment: "left" },
  ],
});


function truncateString(str, num) {
  if (str.length <= num) {
    return str;
  }

  return str.slice(0, num) + "...";
}

for (let index = 0; index < data.length; index++) {
  const command = truncateString(data[index]["command"], 50);
  table.addRow({ index: index, ...data[index], command: command });
}

export { data, table };
