#! /usr/bin/env node

import boxen from "boxen";
import chalk from "chalk";
import yargs from "yargs/yargs";
import { data, table } from "./src/commands.js";
import executeCommand from "./src/executeCommand.js";

const help = () => {
  console.log(
    boxen(
      chalk.green.bold("Commander") +
        "\n----------\nCommand helper for a lazy developer\n" +
        "\nUsage:\n  commander [index],[index]",
      { padding: 1, margin: 1 }
    )
  );
  table.printTable();
  console.log();
};

const argv = yargs(process.argv.slice(2)).argv;
const argvPresent = argv["_"] && argv["_"].length > 0;
const args = argvPresent && String(argv["_"][0]).split(",");

if (args && args.length < 0) {
  help();
  console.log(chalk.red.bold(`\nIncorrect command found: ${argv["_"][0]}\n`));
} else if (args) {
  console.log(boxen(chalk.green.bold("Commander"), { padding: 1, margin: 1 }));
  console.log(chalk.green.bold("\nExecuting following commands in order:\n"));
  await executeCommand(args, data);
  console.log();
} else {
  help();
}

process.exit()
