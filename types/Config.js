const Discord = require("discord.js");
const Command = require("./Command");

class Config {
  /** @type {string[]} */
  prefixes = [];

  /** @type {string} */
  clientToken = "";

  /** @type {Discord.ClientOptions} */
  clientOptions = {};

  /** @type {{timeout(message: Discord.Message, command: Command, timeout: number): void, disabled(message: Discord.Message, command: Command): void, blocked(message: Discord.Message, command: Command): void, botPermsRequired(message: Discord.Message, command: Command, perms: string[]): void, userPermsRequired(message: Discord.Message, command: Command, perms: string[]): void}} */
  messages = {};

  /**
   * @param {Config} arg 
   */
  constructor(arg = {}) {
    if (Array.isArray(arg.prefixes) && arg.prefixes.length != 0) {
      this.prefixes = arg.prefixes;
    } else {
      console.warn(`[UYARI] Ayarlar içerisinde hiçbir prefix belirtilmediği için var sayılan olarak "!" kullanılıyor.`);
      this.prefixes = ["!"];
    }

    if (this.prefixes.some(i => typeof i != "string")) {
      console.error("[HATA] Ayarlardaki prefixler sadece yazı olabilir.");
      process.exit(-1);
    }

    if (this.prefixes.some(i => i.includes(" "))) {
      console.error("[HATA] Ayarlardaki prefixler içerlerinde boşluk içeremezler.");
      process.exit(-1);
    }

    if (!(typeof arg.clientToken == "string" && arg.clientToken.length != 0)) {
      console.error("[HATA] Ayarlar dosayasında geçersiz bot tokeni girişi yapılmış.");
      process.exit(-1);
    };
    this.clientToken = arg.clientToken;
    this.clientOptions = typeof arg.clientOptions == "object" ? arg.clientOptions : {};
    let messageTypes = [
      "timeout",
      "disabled",
      "blocked",
      "botPermsRequired",
      "userPermsRequired"
    ];
    let loadedMessageTypes = Object.keys(arg.messages || {});
    if (
      !messageTypes.every(i => loadedMessageTypes.some(j => j == i)) ||
      Object.values(arg.messages || {}).some(i=>typeof i != "function")
    ) {
      console.error("[HATA] Ayarlar dosyasında hata mesajları düzgün bir şekilde ayarlanmamış!");
      process.exit(-1);
    }
    this.messages = arg.messages;
  }
}

module.exports = Config;