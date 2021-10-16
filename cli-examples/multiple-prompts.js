const prompts = require('prompts');

(async () => {
  const response1 = await prompts({
    type: 'number',
    name: 'value',
    message: 'How old are you?',
    validate: (value) => (value < 18 ? `Nightclub is 18+ only` : true)
  });

  console.log(response1); // => { value: 24 }

  const response2 = await prompts({
    type: 'text',
    name: 'value',
    message: 'What is your name?'
  });

  console.log(response2);
})();
