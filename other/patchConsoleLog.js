try {
  require("chalk");
} catch {
  console.warn("Bu işlemi yapmadan önce gerekli modülleri indirmeniz gerekiyor.")
  console.warn("-> yarn install");
  process.exit(-1);
}

const chalk = require("chalk");

{
  let originalLog = console.log;

  let log = (...args)=>{
    originalLog(chalk.blackBright(`[${new Date().toLocaleTimeString()}]`), ...args)
  }

  console.info = function (...args) {
    args = args.map(i => {
      if (typeof i == "string") return chalk.blueBright(i)
      return i
    })
    log(...args);
  }

  console.warn = function (...args) {
    args = args.map(i => {
      if (typeof i == "string") return chalk.yellowBright(i)
      return i
    })
    log(...args);
  }

  console.error = function (...args) {
    args = args.map(i => {
      if (typeof i == "string") return chalk.redBright(i)
      return i
    })
    log(...args);
  }

  console.debug = function(...args) {
    args = args.map(i => {
      if (typeof i == "string") return chalk.magentaBright(i)
      return i
    })
    log(...args);
  }

  console.log = function(...args) {
    log(...args);
  }
}
