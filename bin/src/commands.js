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

for (let index = 0; index < data.length; index++) {
  table.addRow({ index: index, ...data[index] });
}

export { data, table };
