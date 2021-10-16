const { spawn } = require("child_process");
const { parseOutput } = require("./cli-ansi-parser");

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 *
 * @param {string} commandString
 * @param {Options} options
 */
const createCommandInterface = (commandString, options) => {
  // /** @type {import('child_process').ChildProcessWithoutNullStreams} */
  // let command;
  const commandArgs = commandString.split(" ");
  const command = spawn(commandArgs[0], commandArgs.slice(1), {
    detached: true,
    stdio: "pipe",
    cwd: options.cwd || process.cwd(),
    env: options.env || undefined,
  });

  let outputs = "";
  let isFinishTypingCalled = false;

  command.stdout.on("data", (data) => {
    if (options.logData) {
      console.log(data.toString());
    }
    outputs += data.toString();
  });

  command.stderr.on("data", (error) => {
    if (options.logData) {
      console.error(error.toString());
    }
    outputs += error.toString();
  });

  command.on("error", (error) => {
    throw error;
  });

  const type = async (text) => {
    if (isFinishTypingCalled) {
      throw new Error(
        "[cli-testing-library]: `type` cannot be called after `getOutput` or `finishTyping`"
      );
    }

    await wait(options.typeDelay ? options.typeDelay : 100);

    return new Promise((resolve) => {
      command.stdin.write(`${text}`, () => {
        resolve();
      });
    });
  };

  const keys = {
    enter: () => type("\n"),
    arrowDown: () => type(`${STRING_ESC}1B`),
    arrowUp: () => type(`${STRING_ESC}1A`),
  };

  /**
   * @returns {Promise<ParsedOutput>}
   */
  const getOutput = () => {
    if (!isFinishTypingCalled) {
      finishTyping();
    }
    return new Promise((resolve) => {
      command.stdout.on("end", () => {
        return resolve(parseOutput(outputs.trim()));
      });
    });
  };

  const finishTyping = () => {
    isFinishTypingCalled = true;
    command.stdin.end();
  };

  return {
    type,
    finishTyping,
    getOutput,
    command,
    keys,
  };
};

module.exports = {
  createCommandInterface,
  parseOutput,
};
