const path = require('path');
const { createCommandInterface } = require('../../lib/index');

test('should print greetings', async () => {
  const commandInterface = createCommandInterface('node ./graphic-print.js', {
    cwd: path.join(__dirname, '..')
  });
  await commandInterface.type('Saurabh\n');
  const terminal = await commandInterface.getOutput();

  // ANSI Escape codes are tokenized into readable text token in tokenizedOutput
  // Helpful when libraries like inquirer or prompts add ansi-escape codes.
  expect(terminal.tokenizedOutput).toBe(
    "What's your name?Hi, [BOLD_START][RED_START]Saurabh[COLOR_END][BOLD_END]!"
  );

  // ANSI Escape codes are not tokenized.
  expect(terminal.rawOutput).toBe(
    `What's your name?Hi, \x1B[1m\x1B[31mSaurabh\x1B[39m\x1B[22m!`
  );

  // ANSI Escape codes are removed
  expect(terminal.stringOutput).toBe(`What's your name?Hi, Saurabh!`);
});
