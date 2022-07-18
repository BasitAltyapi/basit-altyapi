{ require("./other/patchConsoleLog"); require("./config");  };

const chokidar = require('chokidar');
const { resolve } = require('path');
const { makeSureFolderExists, execAsync } = require('stuffs');

class FunctionQueue {
  /**
   * 
   * @param {Number} interval 
   * @param {Function} cb 
   */
  constructor(interval, cb) {
    this.interval = interval;
    this.cb = cb;
    this.lastCall = 0;
    this.willTrigger = false;
  }

  async trigger(...args) {

    let now = Date.now();

    if (this.lastCall < now) {
      this.lastCall = now + this.interval;
      await this.cb(...args);
    } else {
      if (this.lastCall < now - 1500) return;
      if (!this.willTrigger) {
        this.willTrigger = true;
        setTimeout(async () => {
          this.lastCall = Date.now() + this.interval;
          this.willTrigger = false;
          await this.cb(...args);
        }, this.lastCall - now);
      }
    }
  }
};
let TypeQueue = new FunctionQueue(15000, async () => {
  let { stderr, stdout } = await execAsync("yarn tipler", process.cwd());
  console.log(stdout.toLowerCase().includes("[hata]") ? stdout : "Tipler yüklendi.");
});
let wait = (s) => new Promise((resolve => setTimeout(() => resolve(true), s)));
(async () => {
  await wait(1000);

  [
    {
      path: "./events",
      name: "Events",
      text: "Eventler izleniyor.",
    },
    {
      path: "./interactions",
      name: "Interactions",
      text: 'Interaksiyonlar izleniyor',
    },
    {
      path: "./plugins",
      name: "Plugins",
      text: 'Pluginler izleniyor',
    },
    {
      path: "./locales",
      name: "Locales",
      text: 'Dil dosyaları izleniyor',
    }
  ].forEach(async (ctx) => {
    let path = resolve(ctx.path);
    await makeSureFolderExists(path);
    const theWatcher = chokidar.watch(path, { persistent: true });
    theWatcher
      .on('add', () => TypeQueue.trigger())
      .on('change', () => TypeQueue.trigger())
      .on('unlink', () => TypeQueue.trigger())
      .on('error', error => console.log(`${ctx.name} Watcher Error: ${error}`))
      .on('ready', () => console.log(ctx.text))
  });
})();