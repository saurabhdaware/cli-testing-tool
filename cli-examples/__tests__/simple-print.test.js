const path = require('path');
const { createCommandInterface } = require('../../lib');

test('should pass', async () => {
  const commandInterface = createCommandInterface('node ./simple-print.js', {
    cwd: path.join(__dirname, '..')
  });
  await commandInterface.type('Saurabh\n');
  await commandInterface.type('22\n');
  const terminal = await commandInterface.getOutput();

  expect(terminal.stringOutput).toBe(
    "What's your name?Hi, Saurabh!\nWhat's your age?So you are 22!"
  );
});
