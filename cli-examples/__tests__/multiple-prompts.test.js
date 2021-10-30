const path = require('path');
const { createCommandInterface } = require('../../lib');

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
      '✔ How old are you? … 19',
      '{ value: 19 }',
      '✔ What is your name? … saurabh',
      "{ value: 'saurabh' }"
    ].join('\n')
  );
});
