const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

readline.question(`What's your name?`, (name) => {
  console.log(`Hi, ${name}!`);
  readline.question(`What's your age?`, (age) => {
    console.log(`So you are ${age}!`);
    readline.close();
  });
});
