try {
    require("chalk");
} catch {
    console.warn("Bu işlemi yapmadan önce gerekli modülleri indirmeniz gerekiyor.")
    console.warn("-> yarn install");
    process.exit(-1);
}

const chalk = require("chalk");

{
  let {log: originalLog} = console, log = (...args) => {
    originalLog(chalk.blackBright(`[${new Date().toLocaleTimeString()}]`), ...args)
  };

  /**
     * @param {*[][]} args
     */
    console.info = function (...args) {
        args = args.map(i => {
          return typeof i == "string" ? chalk.blueBright(i) : i;
        })
        log(...args);
    }

    /**
     * @param {*[][]} args
     */
    console.warn = function (...args) {
        args = args.map(i => {
            if (!(typeof i != "string")) return chalk.yellowBright(i)
            return i
        })
        log(...args);
    }

    /**
     * @param {*[][]} args
     */
    console.error = function (...args) {
        args = args.map(i => {
          return typeof i == "string" ? chalk.redBright(i) : i;
        })
        log(...args);
    }

    /**
     * @param {*[][]} args
     */
    console.debug = function (...args) {
        args = args.map(i => {
            if (typeof i == "string") return chalk.magentaBright(i)
            return i
        })
        log(...args);
    }

    /**
     * @param {*[][]} args
     */
    console.log = function (...args) {
        log(...args);
    }
}
