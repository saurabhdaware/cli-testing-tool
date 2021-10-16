const path = require('path');
const { createCommandInterface } = require('../../lib');

test('should block 12 year old', async () => {
  const commandInterface = createCommandInterface('node ./prompts.js', {
    cwd: path.join(__dirname, '..'),
  });
  await commandInterface.type('12\n');
  const terminal = await commandInterface.getOutput();
  expect(terminal.stringOutput).toBe('? How old are you? › 12\n› Nightclub is 18+ only');
});
