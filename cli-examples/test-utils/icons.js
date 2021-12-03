// Windows is just weird.
const win = process.platform === 'win32';

module.exports = {
  FORWARD_ARROW: win ? '»' : '›',
  CHECK_MARK: win ? '√' : '✔',
  THREE_DOTS: win ? '...' : '…',
  SELECT_ICON: win ? '>' : '❯'
};
