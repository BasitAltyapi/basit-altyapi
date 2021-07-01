const chalk = require("chalk");

{
  let originalLog = console.log;

  console.log = function (...args) {
    originalLog(chalk.blackBright(`[${new Date().toLocaleTimeString()}]`), ...args);
  }

  console.info = function (...args) {
    args = args.map(i => {
      if (typeof i == "string") return chalk.cyanBright(i)
      return i
    })
    console.log(...args);
  }

  console.warn = function (...args) {
    args = args.map(i => {
      if (typeof i == "string") return chalk.yellowBright(i)
      return i
    })
    console.log(...args);
  }

  console.error = function (...args) {
    args = args.map(i => {
      if (typeof i == "string") return chalk.redBright(i)
      return i
    })
    console.log(...args);
  }
}