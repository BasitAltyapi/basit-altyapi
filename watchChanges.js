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
  let eventsPath = resolve("./events");
  await makeSureFolderExists(eventsPath);
  const eventsWatcher = chokidar.watch(eventsPath, { persistent: true });
  eventsWatcher
    .on('add', () => TypeQueue.trigger())
    .on('change', () => TypeQueue.trigger())
    .on('unlink', () => TypeQueue.trigger())
    .on('error', error => console.log(`Events Watcher Error: ${error}`))
    .on('ready', () => console.log('Eventler izleniyor'))

  let InteractionsPath = resolve("./interactions");

  await makeSureFolderExists(InteractionsPath);
  const InteractionsWatcher = chokidar.watch(InteractionsPath, { persistent: true });
  InteractionsWatcher
    .on('add', () => TypeQueue.trigger())
    .on('change', () => TypeQueue.trigger())
    .on('unlink', () => TypeQueue.trigger())
    .on('error', error => console.log(`Interactions Watcher Error: ${error}`))
    .on('ready', () => console.log('Interaksiyonlar izleniyor'))

  let pluginsPath = resolve("./plugins");

  await makeSureFolderExists(pluginsPath);
  const pluginsWatcher = chokidar.watch(pluginsPath, { persistent: true });
  pluginsWatcher
    .on('add', () => TypeQueue.trigger())
    .on('change', () => TypeQueue.trigger())
    .on('unlink', () => TypeQueue.trigger())
    .on('error', error => console.log(`plugins Watcher Error: ${error}`))
    .on('ready', () => console.log('Pluginler izleniyor'))

  let localesPath = resolve("./locales");

  await makeSureFolderExists(localesPath);
  const localesWatcher = chokidar.watch(localesPath, { persistent: true });
  localesWatcher
    .on('add', () => TypeQueue.trigger())
    .on('change', () => TypeQueue.trigger())
    .on('unlink', () => TypeQueue.trigger())
    .on('error', error => console.log(`Locales Watcher Error: ${error}`))
    .on('ready', () => console.log('Dil dosyaları izleniyor'))

})();