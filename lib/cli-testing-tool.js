const { spawn } = require('child_process');
const { parseOutput, STRING_ESC } = require('./cli-ansi-parser');

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// types
/**
 * @typedef {({
 *  stringOutput: string,
 *  tokenizedOutput: string,
 *  rawOutput: string
 * })} ParsedOutput
 *
 * @typedef {({
 *  typeDelay: number,
 *  logData: boolean,
 *  logError: boolean,
 *  cwd: string,
 *  env: any
 * })} Options
 */

/** @type {Options} defaultOptions */
const defaultOptions = {
  typeDelay: 100,
  logData: false,
  logError: true,
  cwd: process.cwd(),
  env: undefined
};

/**
 *
 * @param {string} commandString
 * @param {Options} userOptions
 */
const createCommandInterface = (commandString, userOptions = {}) => {
  const options = { ...defaultOptions, ...userOptions };

  const commandArgs = commandString.split(' ');

  let outputs = '';
  let isFinishTypingCalled = false;
  const inputs = [];

  const initCommandListeners = () => {
    outputs = '';
    isFinishTypingCalled = false;
    const commandInterface = spawn(commandArgs[0], commandArgs.slice(1), {
      detached: true,
      stdio: 'pipe',
      cwd: options.cwd,
      env: options.env
    });

    commandInterface.stdout.on('data', (data) => {
      if (options.logData) {
        console.log(data.toString());
      }
      outputs += data.toString();
    });

    commandInterface.stderr.on('data', (error) => {
      if (options.logData) {
        console.error(error.toString());
      }
      outputs += error.toString();
    });

    commandInterface.on('error', (error) => {
      throw error;
    });

    return commandInterface;
  };

  const command = initCommandListeners();

  const type = async (text) => {
    if (isFinishTypingCalled) {
      console.log(inputs);
      throw new Error(
        // eslint-disable-next-line max-len
        '[cli-testing-tool]: `type` cannot be called after `getOutput` or `finishTyping`'
      );
    }

    await wait(options.typeDelay);
    inputs.push(text);

    return new Promise((resolve) => {
      command.stdin.write(`${text}`, () => {
        resolve();
      });
    });
  };

  const keys = {
    enter: () => type('\n'),
    arrowDown: () => type(`${STRING_ESC}1B`),
    arrowUp: () => type(`${STRING_ESC}1A`)
  };

  /**
   * @returns {Promise<ParsedOutput>}
   */
  const getOutput = () => {
    if (!isFinishTypingCalled) {
      finishTyping();
    }
    return new Promise((resolve) => {
      command.stdout.on('end', () => {
        return resolve(parseOutput(outputs.trim()));
      });
    });
  };

  const finishTyping = () => {
    isFinishTypingCalled = true;
    command.stdin.end();
  };

  // const reset = () => {
  //   command = initCommandListeners();
  // };

  return {
    type,
    finishTyping,
    getOutput,
    command,
    keys
  };
};

module.exports = {
  createCommandInterface,
  parseOutput
};
