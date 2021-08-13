const {defaultify} = require("stuffs");
const { } = require("discord.js");

class Command {

  /** 
   * @private
   */
  _type = "command";

  /** @type {string} */
  name = "";

  /** @type {string} */
  id = "";

  /** @type {"COMMAND"|"SUB_COMMAND"} **/
  type = "COMMAND";

  subName = "";

  /** @type {{bot: import("discord.js").PermissionString[], user: import("discord.js").PermissionString[]}} */
  perms = {bot: [], user: []};

  /** @type {(interaction: import("discord.js").CommandInteraction, other: {setCoolDown(duration:number): void, [key: string|number]: any })=>void} */
  onCommand = () => { };
  
  /** @type {(client: import("discord.js").Client)=>void} */
  onLoad = () => { };

  /** @type {Map<string, number>} */
  coolDowns = new Map();

  /** @type {string} */
  description = ""

  /** @type {boolean} */
  disabled = false;

  /** @type {boolean} */
  developerOnly = false;

  /** @type {{[key: string|number]: any}} */
  other = {};

  /** @type {number} */
  coolDown = 0;

  /** @type {import("discord.js").ApplicationCommandOption[]} */
  options = [];

  /** @type {boolean} */
  guildOnly = true;

  /** @type {boolean} */
  defaultPermission = true;

  /** @type {import("discord.js").ApplicationCommandType} */
  actionType = "CHAT_INPUT"

  /**
   * @param {Omit<Command, "_type" | "coolDowns" >} arg
   */
  constructor(arg = {}) {
    this.name = arg.name;
    this.type = arg.type || global.config.commandDefaults.type;
    this.subName = arg.type == "SUB_COMMAND" ? arg.subName : "";
    this.actionType = arg.actionType || global.config.commandDefaults.actionType;

    this.id = arg.id || arg.type == "COMMAND" ? `${this.actionType}:COMMAND:${this.name}` : arg.type == "SUB_COMMAND" ? `${this.actionType}:SUB_COMMAND:${this.name}:${this.subName}` : null;

    this.perms.bot = Array.isArray(arg.perms?.bot) && arg.perms.bot.length != 0 ? arg.perms.bot : global.config.commandDefaults.perms.bot;
    this.perms.user = Array.isArray(arg.perms?.user) && arg.perms.user.length != 0 ? arg.perms.user : global.config.commandDefaults.perms.user;
    this.onCommand = arg.onCommand;
    if (typeof arg.onLoad == "function") this.onLoad = arg.onLoad;
    this.guildOnly = Boolean(arg.guildOnly ?? global.config.commandDefaults.guildOnly);
    this.description = this.actionType == "CHAT_INPUT" ? (arg.description || global.config.commandDefaults.description) : undefined;
    this.disabled = Boolean(arg.disabled ?? global.config.commandDefaults.disabled);
    this.developerOnly = Boolean(arg.developerOnly ?? global.config.commandDefaults.developerOnly);
    this.other = defaultify(typeof arg.other == "object" ? arg.other : {}, global.config.commandDefaults.other);
    this.coolDown = typeof arg.coolDown == "number" ? arg.coolDown : global.config.commandDefaults.coolDown;
    this.options = Array.isArray(arg.options) ? arg.options : global.config.commandDefaults.options;
    this.defaultPermission = Boolean(arg.defaultPermission ?? global.config.commandDefaults.defaultPermission);
  }
}

module.exports = Command;