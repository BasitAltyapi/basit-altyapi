const Discord = require("discord.js");
const Command = require("./Command");

class Config {

  /** @private */
  _type = "config";

  /** @type {string} */
  clientToken = "";

  /** @type {Discord.ClientOptions} */
  clientOptions = {};

  /** @type {{coolDown(interaction: Discord.CommandInteraction, command: Command, timeout: number): void, disabled(interaction: Discord.CommandInteraction, command: Command): void, blocked(interaction: Discord.CommandInteraction, command: Command): void, botPermsRequired(interaction: Discord.CommandInteraction, command: Command, perms: string[]): void, userPermsRequired(interaction: Discord.CommandInteraction, command: Command, perms: string[]): void, developerOnly(interaction: Discord.CommandInteraction, command: Command): void, guildOnly(interaction: Discord.CommandInteraction, command: Command): void}} */
  userErrors = {};

  /** @type {{[key: string|number]: any}} */
  other = {};

  /** @type {Command} */
  commandDefaults = {};

  /** @type {Set<string>} */
  blockedUsers = new Set();

  /** @type {Set<string>} */
  developers = new Set();

  /** @type {boolean} */
  autoDefer = false;

  /** @type {(client:import("discord.js").Client)=>void} */
  onBeforeLoad = () => { };

  /** @type {(client:import("discord.js").Client)=>void} */
  onAfterLoad = () => { };

  /** @type {(client:import("discord.js").Client)=>void} */
  onReady = () => { };

  /** @type {(command:Command, interaction: Discord.CommandInteraction} */
  onCommandBeforeChecks = async () => { return true; };

  /** @type {(command:Command, interaction: Discord.CommandInteraction, other: {setCoolDown(duration:number): void)=>void} */
  onCommandAfterChecks = async () => { return true; };

  /**
   * @param {Config} arg 
   */
  constructor(arg = {}) {

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

    this.commandDefaults = typeof arg.commandDefaults == "object" ? arg.commandDefaults : {
      aliases: [],
      description: "",
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

    this.autoDefer = Boolean(arg.autoDefer ?? false);

    if (typeof arg.onBeforeLoad == "function") this.onBeforeLoad = arg.onBeforeLoad;
    if (typeof arg.onAfterLoad == "function") this.onAfterLoad = arg.onAfterLoad;
    if (typeof arg.onReady == "function") this.onReady = arg.onReady;
    
    if (typeof arg.onCommandBeforeChecks == "function") this.onCommandBeforeChecks = arg.onCommandBeforeChecks;
    if (typeof arg.onCommandAfterChecks == "function") this.onCommandAfterChecks = arg.onCommandAfterChecks;
  }
}

module.exports = Config;