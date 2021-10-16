const path = require("path");
const { createCommandInterface } = require("../../lib");

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

test("should pass", async () => {
  const commandInterface = createCommandInterface(
    "node ./multiple-prompts.js",
    {
      cwd: path.join(__dirname, ".."),
      logData: true,
    }
  );
  await commandInterface.type("19\n");
  // await wait(100);
  await commandInterface.type("saurabh\n");
  const terminal = await commandInterface.getOutput();
  console.log(terminal);
  expect(1).toBe(1);
});
