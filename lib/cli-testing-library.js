const { spawn } = require('child_process');

const ESC = '\\x1b\\['
const COLOR_ESC = '\\u001b\\[';
const ANSI_CHARACTER_MAPS = {
  ERASE_LINE: `${ESC}2K`,
  CURSOR_LEFT: `${ESC}1G`,
  RED_START: `${COLOR_ESC}31m`,
  CYAN_START: `${COLOR_ESC}36m`,
  GREY_START: `${COLOR_ESC}90m`,
  BOLD_START: `${COLOR_ESC}1m`,
  BOLD_END: `${COLOR_ESC}22m`,
  COLOR_END: `${COLOR_ESC}39m`,
  NEWLINE: '\\n'
}

const parseOutput = (output) => {
  const textAfter = (question) => {
    const questionIndex = output.indexOf(question) + question.length;
    const endlineIndex = output.indexOf('\n', questionIndex + 1);
    const cleanEndlineIndex = endlineIndex <= 0 ? undefined : endlineIndex;
    return output.slice(questionIndex, cleanEndlineIndex).trim();
  };

  const simplifyOutput = () => {
    let out = output;
    for (const [ESCAPE_CHARACTER_NAME, ESCAPE_CHARACTER_REGEX] of Object.entries(ANSI_CHARACTER_MAPS)) {
      out = out.replace(new RegExp(`(${ESCAPE_CHARACTER_REGEX})`, 'g'), `[${ESCAPE_CHARACTER_NAME}]`);
    }

    return out;
  }

  return {
    textAfter,
    rawOutput: output,
    stringOutput: simplifyOutput(),
  };
};

const createCommandInterface = (commandString, options) => {
  // /** @type {import('child_process').ChildProcessWithoutNullStreams} */
  // let command;
  const commandArgs = commandString.split(' ');
  const command = spawn(commandArgs[0], commandArgs.slice(1), {
    detached: true,
    stdio: 'pipe',
    cwd: options.cwd || process.cwd()
  });

  let outputs = '';
  let isFinishTypingCalled = false;

  command.stdout.on('data', (data) => {
    console.log(data.toString());
    outputs += data.toString();
  });

  command.stderr.on('data', (error) => {
    console.error(error.toString());
  });

  command.on('error', (error) => {
    throw error;
  });

  const type = (text) => {
    return new Promise((resolve) => {
      command.stdin.write(`${text}`, () => {
        resolve();
      });
    });
  };

  const keys = {
    enter: async () => {
      return type('\n');
    }
  };

  /**
   *
   * @returns {Promise<{textAfter: (question: string) => string, stringOutput: string}>}
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

  return {
    type,
    finishTyping,
    getOutput,
    command,
    keys
  };
};

// (async () => {
//   const commandInterface = createCommandInterface('node ./experiment.js');
//   await commandInterface.type('Saurabh\n');
//   await commandInterface.type('22\n');
//   const terminal = await commandInterface.getOutput();
//   console.log(terminal);
//   console.log(terminal.answerOf("What's your name?"));
//   console.log(terminal.stringOutput);
// })();

module.exports = {
  createCommandInterface,
  parseOutput
};

// DUMP

// const wait = (ms) => {
//   return new Promise((resolve) => {
//     setTimeout(resolve, ms);
//   });
// };

// const command = spawn('node', ['./experiment.js'], {
//   detached: true,
//   stdio: ['pipe', 'pipe', 'pipe']
// });

// command.stdin.write('Saurabh\n');
// command.stdin.end();

// command.stdout.on('data', (data) => {
//   console.log(`stdout: ${data}`);
// });

// command.stderr.on('data', (data) => {
//   console.log(`stderr: ${data}`);
// });

// command.on('error', (error) => {
//   console.log(`error: ${error.message}`);
// });

// command.on('close', (code) => {
//   console.log(`child process exited with code ${code}`);
// });

// command.on('message', (code) => {
//   console.log(`child process exited with code ${code}`);
// });

// async function main() {
//   const { stdout, stdin, stderr } = await exec(`node ./experiment.js`);
//   console.log({ stderr, stdout, stdin });
// }

// main();
