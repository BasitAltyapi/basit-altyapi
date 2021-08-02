const Discord = require("discord.js");
const Command = require("./Command");

class Config {

  /** @private */
  _type = "config";

  /** @type {string[]} */
  prefixes = [];

  /** @type {string} */
  clientToken = "";

  /** @type {Discord.ClientOptions} */
  clientOptions = {};

  /** @type {{coolDown(message: Discord.Message, command: Command, timeout: number): void, disabled(message: Discord.Message, command: Command): void, blocked(message: Discord.Message, command: Command): void, botPermsRequired(message: Discord.Message, command: Command, perms: string[]): void, userPermsRequired(message: Discord.Message, command: Command, perms: string[]): void, developerOnly(message: Discord.Message, command: Command): void, guildOnly(message: Discord.Message, command: Command): void}} */
  userErrors = {};

  /** @type {{[key: string|number]: any}} */
  other = {};

  /** @type {Command} */
  commandDefaults = {};

  /** @type {Set<string>} */
  blockedUsers = new Set();

  /** @type {Set<string>} */
  developers = new Set();

  /** @type {(client:import("discord.js").Client)=>void} */
  onBeforeLoad = () => { };

  /** @type {(client:import("discord.js").Client)=>void} */
  onAfterLoad = () => { };

  /** @type {(client:import("discord.js").Client)=>void} */
  onReady = () => { };

  /** @type {(command:Command, message: import("discord.js").Message)=>void} */
  onCommandBeforeChecks = async () => { return true; };

  /** @type {(command:Command, message: import("discord.js").Message, other: {plsargs: import("plsargs/src/Result").Result, args: string[], setCoolDown(duration:number): void, usedPrefix: string, usedAlias: string, [key: string|number]: any)=>void} */
  onCommand = async () => { return true; };

  /** @type {Boolean} */
  addCommandNameAsAlias = true;

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
      "coolDown",
      "disabled",
      "blocked",
      "botPermsRequired",
      "userPermsRequired",
      "developerOnly",
      "guildOnly"
    ];
    let loadedMessageTypes = Object.keys(arg.userErrors || {});
    if (
      !messageTypes.every(i => loadedMessageTypes.some(j => j == i)) ||
      Object.values(arg.userErrors || {}).some(i=>typeof i != "function")
    ) {
      console.error("[HATA] Ayarlar dosyasında kullanıcı hataları (userErrors) kısmı düzgün bir şekilde ayarlanmamış!");
      process.exit(-1);
    }

    this.userErrors = arg.userErrors;
    this.other = arg.other || {};

    this.addCommandNameAsAlias = Boolean(arg.addCommandNameAsAlias ?? true);

    this.commandDefaults = typeof arg.commandDefaults == "object" ? arg.commandDefaults : {
      aliases: [],
      desc: "",
      develoeOnly: false,
      disabled: false,
      coolDown: -1,
      guildOnly: true,
      other: {},
      perms: {
        bot: ["SEND_MESSAGES"],
        user: []
      }
    };

    if (
      Array.isArray(arg.blockedUsers) ||
      arg.blockedUsers instanceof Set
    ) this.blockedUsers = new Set([...arg.blockedUsers]);

    if (
      Array.isArray(arg.developers) ||
      arg.developers instanceof Set
    ) this.developers = new Set([...arg.developers]);

    if (typeof arg.onBeforeLoad == "function") this.onBeforeLoad = arg.onBeforeLoad;
    if (typeof arg.onAfterLoad == "function") this.onAfterLoad = arg.onAfterLoad;
    if (typeof arg.onReady == "function") this.onReady = arg.onReady;
    
    if (typeof arg.onCommandBeforeChecks == "function") this.onCommandBeforeChecks = arg.onCommandBeforeChecks;
    if (typeof arg.onCommand == "function") this.onCommand = arg.onCommand;
  }
}

module.exports = Config;