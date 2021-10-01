# [WIP] CLI Testing Library

A testing library that allows you to test input and outputs of your CLI command.

*Note: This is a work in progress. The API is likely going to change.*

**Terminal Text Parsing Support Checklist**
Refer to [Full List of Ansi Escape Codes](https://gist.github.com/fnky/458719343aabd01cfb17a3a4f7296797) that need to be handled.
- [x] Normal text without ansi escape codes
- [x] Colored text (Not thouroughly tested)
- [ ] Cursor movement (Basic Support. Not tested)
- [ ] Erase Line/Screen Clear (Basic Support. Not tested)
- [ ] Screen Modes (No Support)
- [ ] Private Modes (No Support)
- [ ] Multiple Arguments (No Support. Difficult to support this)



## Installation

With NPM:
```sh
npm install --save-dev cli-testing-library 
```

With Yarn:
```sh
yarn add --dev cli-testing-library
```

## Example

**Test file**
```js
// experiment.test.js
const { createCommandInterface } = require('cli-testing-library');

test('should print appropriate greetings', async () => {
  const commandInterface = createCommandInterface('node ./experiment.js', {
    cwd: __dirname
  });
  await commandInterface.type('Saurabh\n');
  await commandInterface.type('22\n');
  const terminal = await commandInterface.getOutput();

  expect(terminal.textAfter("What's your name?")).toBe('Hi, Saurabh!');
  expect(terminal.textAfter("What's your age?")).toBe('So you are 22!');
});
```

**Code that is being tested**
A node program that asks user for their name and age, and then prints a greeting.

```js
// experiment.js
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

readline.question(`What's your name?`, (name) => {
  console.log(`Hi, ${name}!`);
  readline.question(`What's your age?`, (age) => {
    console.log(`So you are ${age}!`);
    readline.close();
  });
});

```