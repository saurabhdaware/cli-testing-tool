const AnsiTerminal = require('node-ansiterminal').AnsiTerminal;
const AnsiParser = require('node-ansiparser');

// types
/**
 * @typedef {({
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
const ESC = '(?:\\x1[bB])|(?:\\u001b)\\[';
const ESC_NO_BRACKET = ESC.replace('\\[', '');
const STRING_ESC = '\x1b[';
const ANY_NUMBER = '(\\d+)';

const ANSI_CHARACTER_MAPS = {
  // Erase
  CLEAR_SCREEN: `${ESC}J`,
  CLEAR_CURSOR_TO_END_SCREEN: `${ESC}0J`,
  CLEAR_CURSOR_TO_START_SCREEN: `${ESC}1J`,
  CLEAR_ENTIRE_SCREEN: `${ESC}2J`,
  CLEAR_LINE: `${ESC}K`,
  CLEAR_CURSOR_TO_END_LINE: `${ESC}0K`,
  CLEAR_CURSOR_TO_START_LINE: `${ESC}1K`,
  CLEAR_ENTIRE_LINE: `${ESC}2K`,

  // Cursor
  CURSOR_TO_HOME: `${ESC}${ANY_NUMBER};${ANY_NUMBER}H`,
  CURSOR_TO_END: `${ESC}${ANY_NUMBER};${ANY_NUMBER}f`,
  CURSOR_UP: `${ESC}${ANY_NUMBER}A`,
  CURSOR_DOWN: `${ESC}${ANY_NUMBER}B`,
  CURSOR_RIGHT: `${ESC}${ANY_NUMBER}C`,
  CURSOR_LEFT: `${ESC}${ANY_NUMBER}D`,
  CURSOR_UP_FROM_BEGINNING: `${ESC}${ANY_NUMBER}E`,
  CURSOR_DOWN_FROM_BEGINNING: `${ESC}${ANY_NUMBER}F`,
  CURSOR_TO_COL: `${ESC}${ANY_NUMBER}G`,
  CURSOR_STORE: `${ESC_NO_BRACKET}7`,
  CURSOR_RESTORE: `${ESC_NO_BRACKET}8`,
  CURSOR_VISIBLE: `${ESC}\\?25h`,
  CURSOR_INVISIBLE: `${ESC}\\?25l`,
  CURSOR_SAVE: `${ESC}s`,
  CURSOR_RESET: `${ESC}u`,

  // Colors
  BLACK_START: `${ESC}30m`,
  RED_START: `${ESC}31m`,
  GREEN_START: `${ESC}32m`,
  YELLOW_START: `${ESC}33m`,
  BLUE_START: `${ESC}34m`,
  MAGENTA_START: `${ESC}35m`,
  CYAN_START: `${ESC}36m`,
  WHITE_START: `${ESC}37m`,
  COLOR_END: `${ESC}39m`,
  GREY_START: `${ESC}90m`,
  BLACK_BG_START: `${ESC}40m`,
  RED_BG_START: `${ESC}41m`,
  GREEN_BG_START: `${ESC}42m`,
  YELLOW_BG_START: `${ESC}43m`,
  BLUE_BG_START: `${ESC}44m`,
  MAGENTA_BG_START: `${ESC}45m`,
  CYAN_BG_START: `${ESC}46m`,
  WHITE_BG_START: `${ESC}47m`,
  BG_END: `${ESC}49m`,

  // Graphics
  BOLD_START: `${ESC}1m`,
  BOLD_END: `${ESC}22m`,
  FAINT_START: `${ESC}2m`,
  FAINT_END: `${ESC}22m`,
  ITALIC_START: `${ESC}3m`,
  ITALIC_END: `${ESC}23m`,
  UNDERLINE_START: `${ESC}4m`,
  UNDERLINE_END: `${ESC}24m`,
  BLINKING_START: `${ESC}5m`,
  BLINKING_END: `${ESC}25m`,
  INVERSE_START: `${ESC}7m`,
  INVERSE_END: `${ESC}27m`,
  HIDDEN_START: `${ESC}8m`,
  HIDDEN_END: `${ESC}28m`,
  STRIKE_START: `${ESC}9m`,
  STRIKE_END: `${ESC}29m`

  // @TODO: Screen Modes
};

const parseOutput = (output) => {
  const tokenizeOutput = () => {
    let out = output;
    for (const [
      ESCAPE_CHARACTER_NAME,
      ESCAPE_CHARACTER_REGEX
    ] of Object.entries(ANSI_CHARACTER_MAPS)) {
      out = out.replace(
        new RegExp(`${ESCAPE_CHARACTER_REGEX}`, 'g'),
        (...args) => {
          const hasCapturedElement = args.length > 3;
          const firstCapture = args[1];
          return `[${ESCAPE_CHARACTER_NAME}${
            hasCapturedElement ? `_${firstCapture}` : ''
          }]`;
        }
      );
    }

    return out;
  };

  const finalString = () => {
    const terminal = new AnsiTerminal(80, 25, 500);
    const terminalParser = new AnsiParser(terminal);
    terminalParser.parse(output);
    const trimmedOutput = terminal
      .toString()
      .trim()
      .replace(/[ \t]{2,}/g, '');
    return trimmedOutput;
  };

  return {
    rawOutput: output,
    tokenizedOutput: tokenizeOutput(),
    stringOutput: finalString()
  };
};

module.exports = { parseOutput, STRING_ESC, ANSI_CHARACTER_MAPS };
