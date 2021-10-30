# [WIP] CLI Testing Library

A testing library that allows you to test input and outputs of your CLI command.

*Note: This is a work in progress. The API is likely going to change.*

**Terminal Text Parsing Support Checklist**
Refer to [Full List of Ansi Escape Codes](https://gist.github.com/fnky/458719343aabd01cfb17a3a4f7296797) that need to be handled.
- [x] Normal text without ansi escape codes
- [x] Colored text (Not thouroughly tested)
- [x] Cursor movement (Basic Support. Not tested)
- [x] Erase Line/Screen Clear (Basic Support. Not tested)
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

## Examples

Check out [Interactive Examples on Stackblitz](https://stackblitz.com/edit/node-kfod5b?file=examples%2Fprompts%2Fprompts.test.js)

### Hello World Example

```js
// hello-world.test.js
const { createCommandInterface } = require('cli-testing-library');

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

Check out [More Examples on Stackblitz](https://stackblitz.com/edit/node-kfod5b?file=examples%2Fprompts%2Fprompts.test.js)


Big Shoutout to 
- [@fnky](https://github.com/fnky) for the [list of all ansi escape codes](https://gist.github.com/fnky/458719343aabd01cfb17a3a4f7296797)
- [@netzkolchose](https://github.com/netzkolchose) for [node-ansiterminal](https://github.com/netzkolchose/node-ansiterminal) library.
