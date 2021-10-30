const path = require('path');
const { createCommandInterface } = require('../../lib');
const { CHECK_MARK, THREE_DOTS } = require('../test-utils/icons');

test('should pass', async () => {
  const commandInterface = createCommandInterface(
    'node ./multiple-prompts.js',
    {
      cwd: path.join(__dirname, '..')
    }
  );
  await commandInterface.type('19\n');
  await commandInterface.type('saurabh\n');
  const terminal = await commandInterface.getOutput();
  expect(terminal.stringOutput).toBe(
    [
      `${CHECK_MARK} How old are you? ${THREE_DOTS} 19`,
      '{ value: 19 }',
      `${CHECK_MARK} What is your name? ${THREE_DOTS} saurabh`,
      "{ value: 'saurabh' }"
    ].join('\n')
  );
});
