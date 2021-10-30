const path = require('path');
const { createCommandInterface } = require('../../lib');
const {
  FORWARD_ARROW,
  CHECK_MARK,
  THREE_DOTS
} = require('../test-utils/icons');

test('should block 12 year old', async () => {
  const commandInterface = createCommandInterface('node ./prompts.js', {
    cwd: path.join(__dirname, '..')
  });
  await commandInterface.type('12\n');
  const terminal = await commandInterface.getOutput();
  expect(terminal.stringOutput.replace(/  /g, '')).toBe(
    // eslint-disable-next-line max-len
    `? How old are you? ${FORWARD_ARROW} 12\n${FORWARD_ARROW} Nightclub is 18+ only`
  );
});

test('should allow 20 year old', async () => {
  const commandInterface = createCommandInterface('node ./prompts.js', {
    cwd: path.join(__dirname, '..')
  });
  await commandInterface.type('20\n');
  const terminal = await commandInterface.getOutput();
  expect(terminal.stringOutput).toBe(
    `${CHECK_MARK} How old are you? ${THREE_DOTS} 20\n{ value: 20 }`
  );
});
