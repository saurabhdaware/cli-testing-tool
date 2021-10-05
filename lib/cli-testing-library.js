const { spawn } = require('child_process');

// Big shoutout to https://gist.github.com/fnky/458719343aabd01cfb17a3a4f7296797 for super cool reference to all ansi codes
const ESC = '(?:\\x1[bB])|(?:\\u001b)\\[';
const ESC_NO_BRACKET = ESC.replace('\\[', '');
const ANSI_CHARACTER_MAPS = {
  ERASE_LINE: `${ESC}2K`,
  CURSOR_LEFT: `${ESC}1G`,
  CURSOR_UP: `${ESC}1A`,
  CURSOR_DOWN: `${ESC}1B`,
  CURSOR_VISIBLE: `${ESC}\\?25h`,
  CURSOR_INVISIBLE: `${ESC}\\?25l`,
  CURSOR_STORE: `${ESC_NO_BRACKET}7`,
  CURSOR_RESTORE: `${ESC_NO_BRACKET}8`,
  UNDERLINE: `${ESC}4m`,
  UNDERLINE_END: `${ESC}24m`,
  RED_START: `${ESC}31m`,
  GREEN_START: `${ESC}32m`,
  YELLOW_START: `${ESC}33m`,
  BLUE_START: `${ESC}34m`,
  CYAN_START: `${ESC}36m`,
  GREY_START: `${ESC}90m`,
  COLOR_END: `${ESC}39m`,
  BOLD_START: `${ESC}1m`,
  BOLD_END: `${ESC}22m`,
  BOLD_2_START: `${ESC}3m`,
  BOLD_2_END: `${ESC}23m`,
}

const parseOutput = (output) => {
  const textAfter = (question) => {
    const questionIndex = output.indexOf(question) + question.length;
    const endlineIndex = output.indexOf('\n', questionIndex + 1);
    const cleanEndlineIndex = endlineIndex <= 0 ? undefined : endlineIndex;
    return output.slice(questionIndex, cleanEndlineIndex).trim();
  };

  const tokenizeOutput = () => {
    let out = output;
    for (const [ESCAPE_CHARACTER_NAME, ESCAPE_CHARACTER_REGEX] of Object.entries(ANSI_CHARACTER_MAPS)) {
      out = out.replace(new RegExp(`(${ESCAPE_CHARACTER_REGEX})`, 'g'), `[${ESCAPE_CHARACTER_NAME}]`);
    }

    return out;
  }

  const finalString = () => {
    let parsedOutput = tokenizeOutput();

    // parsedOutput = parsedOutput.replace(/\[(\w*)\]/g, (match, token) => {
    //   if (token === 'ERASE_LINE' || token === 'NEWLINE') return match;
    //   return '';
    // })

    const lastEraseLineIndex = parsedOutput.lastIndexOf('[ERASE_LINE]')

    const outputAfterLastEraseLine = parsedOutput.slice(lastEraseLineIndex > 0 ? lastEraseLineIndex : 0);


    // while (parsedOutput.includes('[ERASE_LINE]')) {
    //   const NEWLINE_INDEX = parsedOutput.indexOf('[NEWLINE]');
    //   const ERASE_LINE_INDEX = parsedOutput.indexOf('[ERASE_LINE]');
    //   parsedOutput = parsedOutput.slice(
    //     NEWLINE_INDEX > 0 ? NEWLINE_INDEX : 0,
    //     ERASE_LINE_INDEX > 0 ? ERASE_LINE_INDEX + '[ERASE_LINE]'.length: parsedOutput.length
    //   );
    // }

    return outputAfterLastEraseLine.replace(/\[(\w*)\]/g, '');
  }

  return {
    textAfter,
    rawOutput: output,
    tokenizedOutput: tokenizeOutput(),
    stringOutput: finalString(),
  };
};

const createCommandInterface = (commandString, options) => {
  // /** @type {import('child_process').ChildProcessWithoutNullStreams} */
  // let command;
  const commandArgs = commandString.split(' ');
  const command = spawn(commandArgs[0], commandArgs.slice(1), {
    detached: true,
    stdio: 'pipe',
    cwd: options.cwd || process.cwd(),
    env: options.env || undefined,
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
