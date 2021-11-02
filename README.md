# [WIP] CLI Testing Tool

A testing library that allows you to test input and outputs of your CLI command.

*Note: This is a work in progress. The API is likely going to change.*

**Terminal Text Parsing Support Checklist**
Refer to [Full List of Ansi Escape Codes](https://gist.github.com/fnky/458719343aabd01cfb17a3a4f7296797) that need to be handled.
- [x] Normal text without ansi escape codes
- [x] Colored text
- [x] Cursor movement (Basic Support. Not tested)
- [x] Erase Line/Screen Clear (Basic Support. Not tested)
- [ ] Screen Modes (No Support)
- [ ] Private Modes (No Support)
- [ ] Multiple Arguments (No Support. Difficult to support this)



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

### Eg 1: Hello World Example

```js
// hello-world.test.js
const { createCommandInterface } = require('cli-testing-tool');

test('should print greetings', async () => {
  const commandInterface = createCommandInterface('node ./hello-world.js', {
    cwd: __dirname, // Directory from where you want to run the command 
  });
  await commandInterface.type('Saurabh\n');
  const terminal = await commandInterface.getOutput();
  expect(terminal.stringOutput).toBe("What's your name?Hi, Saurabh!");
});
```

The code that we're testing-
```js
// hello-world.js
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
});

readline.question(`What's your name?`, (name) => {
  console.log(`Hi, ${name}!`);
  readline.close();
});

```

### Eg 2: Tokenized Output

Check out [this example of StackBlitz](https://stackblitz.com/edit/node-kfod5b?file=examples%2Fcolored-output%2Fcolored-output.test.js)

Sometimes you may want to test if the output has correct color and graphics. You can use the `.tokenizedOutput` method to get tokens in the output.

Check out [list of tokens](https://github.com/saurabhdaware/cli-testing-tool/blob/18e1e12d86cec7b429f949cdd571b13b64fd4747/lib/cli-ansi-parser.js#L28) that library outputs.

```js
// colored-output.test.js
const { createCommandInterface } = require('cli-testing-tool');

test('should have bold red text', async () => {
  const commandInterface = createCommandInterface('node ./colored-output.js', {
    cwd: __dirname,
  });
  const terminal = await commandInterface.getOutput();
  expect(terminal.tokenizedOutput).toBe("This has a [BOLD_START][RED_START]red and bold[COLOR_END][BOLD_END] text.");
});
```

[More Examples on Stackblitz](https://stackblitz.com/edit/node-kfod5b?file=examples%2Fprompts%2Fprompts.test.js)


Big Shoutout to 
- [@fnky](https://github.com/fnky) for the [list of all ansi escape codes](https://gist.github.com/fnky/458719343aabd01cfb17a3a4f7296797).
- [@netzkolchose](https://github.com/netzkolchose) for [node-ansiterminal](https://github.com/netzkolchose/node-ansiterminal) library.
