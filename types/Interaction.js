const {defaultify} = require("stuffs");

class Interaction {

  /** 
   * @private
   */
  _type = "interaction";

  name = "";

  id = "";

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

  autoDefer = "off";

  calculated = {};

  constructor(arg = {}) {
    this.name = Array.isArray(arg.name) ? arg.name : [arg.name];
    this.actionType = arg.actionType || Underline.config.interactionDefaults.actionType;

    this.id = arg.id || `${this.actionType}_${this.name.join("_")}`.toLowerCase();
    this._type = arg._type ?? this._type;
    this.nullError = (this._type === "noDeployInteraction") ? (arg.nullError ?? false) : false;
    this.perms.bot = Array.isArray(arg.perms?.bot) && arg.perms.bot.length != 0 ? arg.perms.bot : Underline.config.interactionDefaults.perms.bot;
    this.perms.user = Array.isArray(arg.perms?.user) && arg.perms.user.length != 0 ? arg.perms.user : Underline.config.interactionDefaults.perms.user;
    this.onInteraction = arg.onInteraction;
    if (typeof arg.onLoad == "function") this.onLoad = arg.onLoad;
    this.guildOnly = Boolean(arg.guildOnly ?? Underline.config.interactionDefaults.guildOnly);
    this.description = this.actionType == "CHAT_INPUT" ? (arg.description || Underline.config.interactionDefaults.description) : null;
    this.disabled = Boolean(arg.disabled ?? Underline.config.interactionDefaults.disabled);
    this.developerOnly = Boolean(arg.developerOnly ?? Underline.config.interactionDefaults.developerOnly);
    this.other = defaultify(typeof arg.other == "object" ? arg.other : {}, Underline.config.interactionDefaults.other);
    this.coolDown = arg.coolDown ?? Underline.config.interactionDefaults.coolDown;
    this.options = arg.options;
    this.publishType = arg.publishType ?? "all";
    this.defaultPermission = Boolean(arg.defaultPermission ?? Underline.config.interactionDefaults.defaultPermission);
    this.autoDefer = arg.autoDefer ?? Underline.config.interactionDefaults.autoDefer;
  }
}

module.exports = Interaction;
