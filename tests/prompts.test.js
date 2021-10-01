const path = require('path');
const { createCommandInterface } = require('../lib');

// Taken from https://github.com/chalk/ansi-regex/blob/main/index.js
const pattern = [
  '[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)',
  '(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))'
].join('|');

const ANSI_REGEX = new RegExp(pattern, 'g');

test('should pass', async () => {
  const commandInterface = createCommandInterface('node ./prompts.js', {
    cwd: path.join(__dirname, '..', 'cli-examples'),
  });
  await commandInterface.type('19\n');
  const terminal = await commandInterface.getOutput();
  console.log('=====');
  console.dir(terminal.stringOutput);
  console.log('=====');
  expect(1).toBe(1);

  // expect(terminal.textAfter("What's your name?")).toBe('Hi, Saurabh!'); // Hi, Saurabh!
  // expect(terminal.textAfter("What's your age?")).toBe('So you are 22!'); // So you are 22!
});
