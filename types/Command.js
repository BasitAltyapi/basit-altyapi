class Command {
  
  /** @type {string} */
  name = "";

  /** @type {string[]} */
  aliases = [];

  /** @type {{bot: import("discord.js").PermissionString[], user: import("discord.js").PermissionString[]}} */
  perms = {bot: [], user: []};

  /** @type {(message: import("discord.js").Message, other: {plsargs: import("plsargs/src/Result").Result, args: string[], setCooldown(duration:number): void, usedPrefix: string, usedAlias: string})=>void} */
  onCommand = () => { };
  
  /** @type {(client: import("discord.js").Client)=>void} */
  onLoad = ()=>{};

  /** @type {Map<string, number>} */
  coolDowns = new Map();

  guildOnly = true;

  desc = "Açıklama belirtilmemiş."

  disabled = false;

  developerOnly = false;

  /**
   * @param {Command & {onCommand(())}} arg
   */
  constructor(arg = {}) {
    this.name = arg.name;
    this.aliases = Array.isArray(arg.aliases) ? arg.aliases : [];
    this.perms.bot = Array.isArray(arg.perms?.bot) && arg.perms.bot.length != 0 ? arg.perms.bot : [];
    this.perms.user = Array.isArray(arg.perms?.user) && arg.perms.user.length != 0 ? arg.perms.user : [];
    this.onCommand = arg.onCommand;
    if (typeof arg.onLoad == "function") this.onLoad = arg.onLoad;
    this.guildOnly = Boolean(arg.guildOnly ?? true);
    if (typeof arg.desc == "string") this.desc = arg.desc;
    this.disabled = Boolean(arg.disabled);
  }
}

module.exports = Command;