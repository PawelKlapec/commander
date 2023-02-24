import chalk from "chalk";
import {exec} from "node:child_process";
import util from "node:util";
import readline from "readline";
import boxen from "boxen";

const execPromise = util.promisify(exec);

const userInput = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const validate = (args, data) => {
  for (let index = 0; index < args.length; index++) {
    const number = args[index];
    const command = data[number];

    if (!command) {
      console.log(chalk.red.bold(`Error: command ${number} not found`));
      return false;
    }

    console.log(command['command']);
  }

  console.log();

  return true;
};

const executeCommand = async (command) => {
  try {
    const {stdout, stderr} = await execPromise(command);
    console.log(boxen(`${command}`));
    console.log(`${stdout}`);

    if (stderr) {
      console.log(chalk.red.bold(`Stderr: ${stderr}`));
      return false;
    }
  } catch (error) {
      console.log(chalk.red.bold(`Error: ${error}`));
      return false;
    }

  return true;
};

const question = () => {
  let result = true;

  userInput.question(
    "Would you like to continue despite error? (Y/N)",
    (name) => {
      const value = String(name).toLowerCase();
      result = value == "y" || name == "yes";
      userInput.close();
    }
  );

  return result;
};

export default async (args, data) => {
  if (!validate(args, data)) {
    return;
  }

  for (let index = 0; index < args.length; index++) {
    const number = args[index];
    const command = data[number];

    try {
      const result = await executeCommand(command["command"]);
      if (!result) {
        if (!question()) {
          return;
        }
      }
    } catch (error) {
      const message = `Error: ${error}`;
      console.log(chalk.red.bold(message));
    }
  }
};
