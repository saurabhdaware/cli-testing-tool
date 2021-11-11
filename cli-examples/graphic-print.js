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
