import chalk from "chalk";
import {exec} from "node:child_process";
import util from "node:util";
import readline from "readline";
import boxen from "boxen";

const execPromise = util.promisify(exec);

const validate = (args, data) => {
  for (let index = 0; index < args.length; index++) {
    const number = args[index];
    const command = data[number];

    if (!command) {
      console.log(chalk.red.bold(`Error: command ${number} not found`));
      return false;
    }

    console.log(command["command"]);
  }

  console.log();

  return true;
};

const executeCommand = async (command) => {
  try {
    const { stdout, stderr } = await execPromise(command);
    console.log(boxen(`${command}`));
    console.log(`${stdout}`);

    if (stderr) {
      console.log(chalk.red.bold(`Stderr: ${stderr}`));
      return false;
    }
  } catch (error) {
    console.log(chalk.red.bold(`${error}`));
    return false;
  }

  return true;
};

const question = () => {
  const query = "Would you like to continue despite error? (y/n): ";

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) =>
    rl.question(query, (ans) => {
      rl.close();
      resolve(ans);
    })
  );
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
        const questionResult = await question();
        const value = String(questionResult).toLowerCase();
        const answer = value == "y" || value == "yes";
        if (!answer) {
          console.log("\nGoodbye.");
          return;
        }
      }
    } catch (error) {
      const message = error;
      console.log(chalk.red.bold(message));
    }
  }
};
