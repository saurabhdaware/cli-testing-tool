const path = require('path');
const { createCommandInterface } = require('../../lib');

test('should pass', async () => {
  const commandInterface = createCommandInterface('node ./simple-print.js', {
    cwd: path.join(__dirname, '..')
  });
  await commandInterface.type('Saurabh\n');
  await commandInterface.type('22\n');
  const terminal = await commandInterface.getOutput();

  expect(terminal.textAfter("What's your name?")).toBe('Hi, Saurabh!'); // Hi, Saurabh!
  expect(terminal.textAfter("What's your age?")).toBe('So you are 22!'); // So you are 22!
});
