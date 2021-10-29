const { parseOutput } = require('../cli-ansi-parser');

describe('parseOutput', () => {
  test('should tokenize cursor move escape codes', () => {
    const cursorMove = '\x1b[10A\x1b[12B\x1b[34C\x1b[56D';
    const { tokenizedOutput: cursorMoveOutput } = parseOutput(cursorMove);
    expect(cursorMoveOutput).toBe(
      '[CURSOR_UP_10][CURSOR_DOWN_12][CURSOR_RIGHT_34][CURSOR_LEFT_56]'
    );
  });
});
