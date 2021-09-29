const path = require('path');
const { createCommandInterface } = require('../lib');

test('should pass', async () => {
  const commandInterface = createCommandInterface('node ./experiment.js', {
    cwd: path.join(__dirname, '..', 'cli-examples'),
  });
  await commandInterface.type('Saurabh\n22\n');
  const terminal = await commandInterface.getOutput();

  expect(terminal.textAfter("What's your name?")).toBe('Hi, Saurabh!'); // Hi, Saurabh!
  expect(terminal.textAfter("What's your age?")).toBe('So you are 22!'); // So you are 22!
});
