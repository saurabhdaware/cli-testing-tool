# CLI Testing Tool

// test

A testing library that allows you to test input and outputs of your CLI command.

*Note: This is WIP but it should be ready enough for most common CLI use-cases I can think of*

## Installation

With NPM:
```sh
npm install --save-dev cli-testing-tool 
```

With Yarn:
```sh
yarn add --dev cli-testing-tool
```

## Examples

Check out [Interactive Examples on Stackblitz](https://stackblitz.com/edit/node-kfod5b?file=examples%2Fprompts%2Fprompts.test.js)

### Testing Colored Terminal Text

Check out [this example of StackBlitz](https://stackblitz.com/edit/node-kfod5b?file=examples%2Fgraphic-hello-world%2Fgraphic-hello-world.test.js)

```js
// colored-greeting.test.js
const { createCommandInterface } = require('cli-testing-tool');

test('should print colored greetings', async () => {
  const commandInterface = createCommandInterface('node ./graphic-print.js', {
    cwd: __dirname, // considering, the test file is in the same directory as the cli file
  });
  await commandInterface.type('Saurabh\n');
  const terminal = await commandInterface.getOutput();

  // ANSI Escape codes are tokenized into readable text token in tokenizedOutput
  // Helpful when libraries like inquirer or prompts add ansi-escape codes.
  expect(terminal.tokenizedOutput).toBe(
    "What's your name?Hi, [BOLD_START][RED_START]Saurabh[COLOR_END][BOLD_END]!"
  );

  // ANSI Escape codes are not tokenized.
  expect(terminal.rawOutput).toBe(
    `What's your name?Hi, \x1B[1m\x1B[31mSaurabh\x1B[39m\x1B[22m!`
  );

  // ANSI Escape codes are removed
  expect(terminal.stringOutput).toBe(`What's your name?Hi, Saurabh!`);
});

```

<details>
<summary>Code of the CLI that we're testing in above snippet</summary>

```js
// colored-greeting.js
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

const bold = (str) => `\x1b[1m${str}\x1b[22m`;
const red = (str) => `\x1b[31m${str}\x1b[39m`;

readline.question(`What's your name?`, (name) => {
  console.log(`Hi, ${bold(red('Saurabh'))}!`);
  readline.close();
});

```

</details>



## Options

You can pass options as 2nd param to `createCommandInterface`.

The default options are:
```js
const defaultOptions = {
  typeDelay: 100, // number. delay between each `.type()` call
  logData: false, // boolean. if true, logs the command data on terminal
  logError: true, // boolean. if false, won't add command errors on terminal
  cwd: process.cwd(), // string. working directory from where your simulated command is executed
  env: undefined // object | undefined. environment variables object if there are any
};
```


## Terminal Text Parsing Support Checklist
Refer to [Full List of Ansi Escape Codes](https://gist.github.com/fnky/458719343aabd01cfb17a3a4f7296797) that need to be handled.
- [x] Normal text without ansi escape codes
- [x] Colored text
- [x] Cursor movement (Basic Support. Not tested)
- [x] Erase Line/Screen Clear (Basic Support. Not tested)
- [ ] Screen Modes (No Support)
- [ ] Private Modes (No Support)
- [ ] Multiple Arguments (No Support. Difficult to support this)



----

Big Shoutout to 
- [@fnky](https://github.com/fnky) for the [list of all ansi escape codes](https://gist.github.com/fnky/458719343aabd01cfb17a3a4f7296797).

- [@netzkolchose](https://github.com/netzkolchose) for [node-ansiterminal](https://github.com/netzkolchose/node-ansiterminal) library.
