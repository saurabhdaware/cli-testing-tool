// types
/**
 * @typedef {({
 *  textAfter: (question: string) => string,
 *  stringOutput: string,
 *  tokenizedOutput: string,
 *  rawOutput: string
 * })} ParsedOutput
 *
 * @typedef {({
 *  typeDelay: number,
 *  logData: boolean,
 *  cwd: string,
 *  env: any
 * })} Options
 */

// Big shoutout to https://gist.github.com/fnky/458719343aabd01cfb17a3a4f7296797 for super cool reference to all ansi codes
const ESC = "(?:\\x1[bB])|(?:\\u001b)\\[";
const ESC_NO_BRACKET = ESC.replace("\\[", "");
const STRING_ESC = "\x1b[";
const ANSI_CHARACTER_MAPS = {
  // Cursor and Line erase
  ERASE_LINE: `${ESC}2K`,
  CURSOR_LEFT: `${ESC}1G`,
  CURSOR_UP: `${ESC}1A`,
  CURSOR_DOWN: `${ESC}1B`,
  CURSOR_VISIBLE: `${ESC}\\?25h`,
  CURSOR_INVISIBLE: `${ESC}\\?25l`,
  CURSOR_STORE: `${ESC_NO_BRACKET}7`,
  CURSOR_RESTORE: `${ESC_NO_BRACKET}8`,
  // Colors
  RED_START: `${ESC}31m`,
  GREEN_START: `${ESC}32m`,
  YELLOW_START: `${ESC}33m`,
  BLUE_START: `${ESC}34m`,
  CYAN_START: `${ESC}36m`,
  GREY_START: `${ESC}90m`,
  COLOR_END: `${ESC}39m`,
  // Graphics
  BOLD_START: `${ESC}1m`,
  BOLD_END: `${ESC}22m`,
  ITALIC_START: `${ESC}3m`,
  ITALIC_END: `${ESC}23m`,
  UNDERLINE_START: `${ESC}4m`,
  UNDERLINE_END: `${ESC}24m`,
};

const parseOutput = (output) => {
  const textAfter = (question) => {
    const questionIndex = output.indexOf(question) + question.length;
    const endlineIndex = output.indexOf("\n", questionIndex + 1);
    const cleanEndlineIndex = endlineIndex <= 0 ? undefined : endlineIndex;
    return output.slice(questionIndex, cleanEndlineIndex).trim();
  };

  const tokenizeOutput = () => {
    let out = output;
    for (const [
      ESCAPE_CHARACTER_NAME,
      ESCAPE_CHARACTER_REGEX,
    ] of Object.entries(ANSI_CHARACTER_MAPS)) {
      out = out.replace(
        new RegExp(`(${ESCAPE_CHARACTER_REGEX})`, "g"),
        `[${ESCAPE_CHARACTER_NAME}]`
      );
    }

    return out;
  };

  const finalString = () => {
    let parsedOutput = tokenizeOutput();
    const lastEraseLineIndex = parsedOutput.lastIndexOf("[ERASE_LINE]");
    const outputAfterLastEraseLine = parsedOutput.slice(
      lastEraseLineIndex > 0 ? lastEraseLineIndex : 0
    );
    return outputAfterLastEraseLine.replace(/\[(\w*)\]/g, "");
  };

  return {
    textAfter,
    rawOutput: output,
    tokenizedOutput: tokenizeOutput(),
    stringOutput: finalString(),
  };
};

module.exports = { parseOutput, STRING_ESC, ANSI_CHARACTER_MAPS };
