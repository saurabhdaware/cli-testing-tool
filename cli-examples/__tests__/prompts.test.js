const path = require("path");
const { createCommandInterface } = require("../../lib");

// Windows is just weird.
const FORWARD_ARROW = process.platform === "win32" ? "»" : "›";

test("should block 12 year old", async () => {
  const commandInterface = createCommandInterface("node ./prompts.js", {
    cwd: path.join(__dirname, ".."),
  });
  await commandInterface.type("12\n");
  const terminal = await commandInterface.getOutput();
  expect(terminal.stringOutput).toBe(
    `? How old are you? ${FORWARD_ARROW} 12\n${FORWARD_ARROW} Nightclub is 18+ only`
  );
});
