const {defaultify} = require("stuffs");

class Command {

  /** 
   * @private
   */
  _type = "interaction";

  name = "";

  id = "";

  type = "COMMAND";

  subName = "";

  perms = {bot: [], user: []};

  onInteraction = () => { };

  onLoad = () => { };

  coolDowns = new Map();

  description = ""

  disabled = false;

  developerOnly = false;

  other = {};

  coolDown = 0;

  options = [];

  guildOnly = true;

  defaultPermission = true;

  actionType = "CHAT_INPUT"

  constructor(arg = {}) {
    this.name = arg.name;
    this.type = arg.type || Underline.config.interactionDefaults.type;
    this.subName = arg.type == "SUB_COMMAND" ? arg.subName : "";
    this.actionType = arg.actionType || Underline.config.interactionDefaults.actionType;

    this.id = arg.id || arg.type == "COMMAND" ? `${this.actionType}:COMMAND:${this.name}` : arg.type == "SUB_COMMAND" ? `${this.actionType}:SUB_COMMAND:${this.name}:${this.subName}` : null;

    this.perms.bot = Array.isArray(arg.perms?.bot) && arg.perms.bot.length != 0 ? arg.perms.bot : Underline.config.interactionDefaults.perms.bot;
    this.perms.user = Array.isArray(arg.perms?.user) && arg.perms.user.length != 0 ? arg.perms.user : Underline.config.interactionDefaults.perms.user;
    this.onInteraction = arg.onInteraction;
    if (typeof arg.onLoad == "function") this.onLoad = arg.onLoad;
    this.guildOnly = Boolean(arg.guildOnly ?? Underline.config.interactionDefaults.guildOnly);
    this.description = this.actionType == "CHAT_INPUT" ? (arg.description || Underline.config.interactionDefaults.description) : undefined;
    this.disabled = Boolean(arg.disabled ?? Underline.config.interactionDefaults.disabled);
    this.developerOnly = Boolean(arg.developerOnly ?? Underline.config.interactionDefaults.developerOnly);
    this.other = defaultify(typeof arg.other == "object" ? arg.other : {}, Underline.config.interactionDefaults.other);
    this.coolDown = typeof arg.coolDown == "number" ? arg.coolDown : Underline.config.interactionDefaults.coolDown;
    this.options = Array.isArray(arg.options) ? arg.options : Underline.config.interactionDefaults.options;
    this.defaultPermission = Boolean(arg.defaultPermission ?? Underline.config.interactionDefaults.defaultPermission);
  }
}

module.exports = Command;