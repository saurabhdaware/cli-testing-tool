const prompts = require('prompts');

const questions = [
  {
    type: 'autocomplete',
    message: `test: `,
    name: 'selectedProject',
    choices: [
      {
        title: 'test 1',
        value: 'test1'
      },
      {
        title: 'test 2',
        value: 'test2'
      }
    ],
    limit: 10
  }
];

(async () => {
  const { selectedProject } = await prompts(questions);
  console.log(selectedProject);
})();
