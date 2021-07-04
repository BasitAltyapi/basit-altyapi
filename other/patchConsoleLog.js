try {
  require("chalk");
} catch {
  console.warn("Bu işlemi yapamadan önce gerkli modülleri indirmeniz gerkiyor.")
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
      if (typeof i == "string") return chalk.cyanBright(i)
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
}