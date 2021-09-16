# [WIP] CLI Testing Library

A testing library that allows you to test input and outputs of your CLI command.

```js
const { createCommandInterface } = require('cli-testing-library');

test('should print appropriate greetings', async () => {
  const commandInterface = createCommandInterface('node ./experiment.js', {
    cwd: __dirname
  });
  await commandInterface.type('Saurabh\n22\n');
  const terminal = await commandInterface.getOutput();

  expect(terminal.textAfter("What's your name?")).toBe('Hi, Saurabh!');
  expect(terminal.textAfter("What's your age?")).toBe('So you are 22!');
});

```