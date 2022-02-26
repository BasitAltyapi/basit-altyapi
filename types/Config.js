const Discord = require("discord.js");
const Interaction = require("./Interaction");

class Config {

  /** @private */
  _type = "config";

  /** @type {string} */
  clientToken = "";

  /** @type {Number} */
  debugLevel = 0;

  /** @type {Discord.ClientOptions} */
  clientOptions = {};

  /** @type {{coolDown(interaction: Discord.CommandInteraction, interaction: Interaction, timeout: number, type: "user" | "member" | "channel" | "guild" | "message" | "any", other: {[key:string|number]: any}): void, disabled(interaction: Discord.CommandInteraction, interaction: Interaction, other: {[key:string|number]: any}): void, blocked(interaction: Discord.CommandInteraction, interaction: Interaction, other: {[key:string|number]: any}): void, botPermsRequired(interaction: Discord.CommandInteraction, interaction: Interaction, perms: string[], other: {setCoolDown(duration:number): void, [key:string|number]: any}): void, userPermsRequired(interaction: Discord.CommandInteraction, interaction: Interaction, perms: string[], other: {setCoolDown(duration:number): void, [key:string|number]: any}): void, developerOnly(interaction: Discord.CommandInteraction, interaction: Interaction, other: {[key:string|number]: any}): void, guildOnly(interaction: Discord.CommandInteraction, interaction: Interaction, other: {[key:string|number]: any}): void, guildOwnerOnly(interaction: Discord.CommandInteraction, interaction: Interaction, other: {[key:string|number]: any}): void}} */
  userErrors = {};

  /** @type {{[key: string|number]: any}} */
  other = {};

  /** @type {import("./Interaction").TOmittedInteraction} */
  interactionDefaults = {};

  /** @type {Set<string> | Array<string>} */
  blockedUsers = new Set();

  /** @type {Set<string> | Array<string>} */
  developers = new Set();

  /** @type {import("./Locale").LocaleString} */
  defaultLanguage = "tr";

  /** @type {(client:import("discord.js").Client)=>void} */
  onBeforeLoad = () => { };

  /** @type {(client:import("discord.js").Client)=>void} */
  onAfterLoad = () => { };

  /** @type {(client:import("discord.js").Client)=>void} */
  onReady = () => { };

  /** @type {(interaction:Command, interaction: Discord.CommandInteraction, other: {[key:string|number]: any})=>boolean} */
  onInteractionBeforeChecks = async () => { return true; };

  /** @type {(interaction:Command, interaction: Discord.CommandInteraction, other: {setCoolDown(duration:number): void, [key:string|number]: any})=>boolean} */
  onInteraction = async () => { return true; };

  /** @type {(interaction:Command, interaction: Discord.CommandInteraction, other: {setCoolDown(duration:number): void, [key:string|number]: any})=>boolean} */
  onAfterInteraction = async () => { return true; };

  /** @type {(eventName: "applicationCommandCreate" | "applicationCommandDelete" | "applicationCommandUpdate" | "channelCreate" | "channelDelete" | "channelPinsUpdate" | "channelUpdate" | "debug" | "emojiCreate" | "emojiDelete" | "emojiUpdate" | "error" | "guildBanAdd" | "guildBanRemove" | "guildCreate" | "guildDelete" | "guildIntegrationsUpdate" | "guildMemberAdd" | "guildMemberAvailable" | "guildMemberRemove" | "guildMembersChunk" | "guildMemberUpdate" | "guildUnavailable" | "guildUpdate" | "interaction" | "interactionCreate" | "invalidated" | "invalidRequestWarning" | "inviteCreate" | "inviteDelete" | "message" | "messageCreate" | "messageDelete" | "messageDeleteBulk" | "messageReactionAdd" | "messageReactionRemove" | "messageReactionRemoveAll" | "messageReactionRemoveEmoji" | "messageUpdate" | "presenceUpdate" | "rateLimit" | "ready" | "roleCreate" | "roleDelete" | "roleUpdate" | "shardDisconnect" | "shardError" | "shardReady" | "shardReconnecting" | "shardResume" | "stageInstanceCreate" | "stageInstanceDelete" | "stageInstanceUpdate" | "stickerCreate" | "stickerDelete" | "stickerUpdate" | "threadCreate" | "threadDelete" | "threadListSync" | "threadMembersUpdate" | "threadMemberUpdate" | "threadUpdate" | "typingStart" | "userUpdate" | "voiceStateUpdate" | "warn" | "webhookUpdate", args: [], other: {[key:string|number]: any})=>boolean} */
  onEvent = async () => { return true; };

  /** @type {(eventName: "applicationCommandCreate" | "applicationCommandDelete" | "applicationCommandUpdate" | "channelCreate" | "channelDelete" | "channelPinsUpdate" | "channelUpdate" | "debug" | "emojiCreate" | "emojiDelete" | "emojiUpdate" | "error" | "guildBanAdd" | "guildBanRemove" | "guildCreate" | "guildDelete" | "guildIntegrationsUpdate" | "guildMemberAdd" | "guildMemberAvailable" | "guildMemberRemove" | "guildMembersChunk" | "guildMemberUpdate" | "guildUnavailable" | "guildUpdate" | "interaction" | "interactionCreate" | "invalidated" | "invalidRequestWarning" | "inviteCreate" | "inviteDelete" | "message" | "messageCreate" | "messageDelete" | "messageDeleteBulk" | "messageReactionAdd" | "messageReactionRemove" | "messageReactionRemoveAll" | "messageReactionRemoveEmoji" | "messageUpdate" | "presenceUpdate" | "rateLimit" | "ready" | "roleCreate" | "roleDelete" | "roleUpdate" | "shardDisconnect" | "shardError" | "shardReady" | "shardReconnecting" | "shardResume" | "stageInstanceCreate" | "stageInstanceDelete" | "stageInstanceUpdate" | "stickerCreate" | "stickerDelete" | "stickerUpdate" | "threadCreate" | "threadDelete" | "threadListSync" | "threadMembersUpdate" | "threadMemberUpdate" | "threadUpdate" | "typingStart" | "userUpdate" | "voiceStateUpdate" | "warn" | "webhookUpdate", args: [], other: {[key:string|number]: any})=>any} */
  onAfterEvent = async () => { return; };

  /** @type {{[key: string|number]: any}} */
  globalObjects = {};

  /**
   * @param {Config} arg 
   */
  constructor(arg = {}) {
    this.debugLevel = arg.debugLevel ?? 0;

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
      Object.values(arg.userErrors || {}).some(i => typeof i != "function")
    ) {
      console.error("[HATA] Ayarlar dosyasında kullanıcı hataları (userErrors) kısmı düzgün bir şekilde ayarlanmamış!");
      process.exit(-1);
    }

    this.userErrors = arg.userErrors;
    this.other = arg.other || {};

    this.defaultLanguage = arg.defaultLanguage || "tr";

    this.interactionDefaults = typeof arg.interactionDefaults == "object" ? arg.interactionDefaults : {
      actionType: "CHAT_INPUT",
      description: "...",
      developerOnly: false,
      guildOnly: true,
      disabled: false,
      coolDown: -1,
      other: {},
      perms: {
        bot: [],
        user: []
      },
      options: [],
      defaultPermission: true,
      autoDefer: "off",
      nullError: false
    };

    if (
      Array.isArray(arg.blockedUsers) ||
      arg.blockedUsers instanceof Set
    ) this.blockedUsers = new Set([...arg.blockedUsers]);

    if (
      Array.isArray(arg.developers) ||
      arg.developers instanceof Set
    ) this.developers = new Set([...arg.developers]);

    this.globalObjects = arg.globalObjects;

    if (typeof arg.onBeforeLoad == "function") this.onBeforeLoad = arg.onBeforeLoad;
    if (typeof arg.onAfterLoad == "function") this.onAfterLoad = arg.onAfterLoad;
    if (typeof arg.onReady == "function") this.onReady = arg.onReady;

    if (typeof arg.onInteractionBeforeChecks == "function") this.onInteractionBeforeChecks = arg.onInteractionBeforeChecks;
    if (typeof arg.onInteraction == "function") this.onInteraction = arg.onInteraction;

    if (typeof arg.onEvent == "function") this.onEvent = arg.onEvent;
    if (typeof arg.onAfterEvent == "function") this.onAfterEvent = arg.onAfterEvent;
  }
}

module.exports = Config;