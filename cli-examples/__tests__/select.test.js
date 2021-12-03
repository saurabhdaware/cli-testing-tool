const path = require('path');
const { createCommandInterface } = require('../../lib');
const {
  FORWARD_ARROW,
  THREE_DOTS,
  SELECT_ICON
} = require('../test-utils/icons');

test('select', async () => {
  const commandInterface = createCommandInterface('node ./select.js', {
    cwd: path.join(__dirname, '..'),
    typeDelay: 500
  });
  const terminalBeforeDownArrow = await commandInterface.getOutput();
  expect(terminalBeforeDownArrow.stringOutput).toMatch(
    // eslint-disable-next-line max-len
    `? test:${THREE_DOTS} \n? test:${FORWARD_ARROW} \n${SELECT_ICON}test 1\ntest 2`
  );
  expect(terminalBeforeDownArrow.stringOutput).toMatch('');
  // move to next item
  await commandInterface.keys.arrowDown();
  const terminalAfterDownArrow = await commandInterface.getOutput();
  expect(terminalAfterDownArrow.stringOutput).toMatch(
    // eslint-disable-next-line max-len
    `? test:${THREE_DOTS} \n? test:${FORWARD_ARROW} \n${SELECT_ICON}test 1\n? test:${FORWARD_ARROW} \ntest 1\n${SELECT_ICON}test 2`
  );
  expect(1).toBe(1);
});
