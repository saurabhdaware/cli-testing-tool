const path = require('path');
const { createCommandInterface } = require('../../lib');

test('test 123', async () => {
  const commandInterface = createCommandInterface('node ./select.js', {
    cwd: path.join(__dirname, '..')
  });
  const terminal = await commandInterface.getOutput();
  console.log(terminal.stringOutput);
  expect(1).toBe(1);
});
