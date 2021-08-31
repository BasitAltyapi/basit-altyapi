require("./patchConsoleLog");

try {
  require("enquirer");
} catch {
  console.warn("Bu işlemi yapmadan önce gerekli modülleri indirmeniz gerekiyor.")
  console.warn("-> yarn install");
  process.exit(-1);
}

const DISCORD_PERMS = ["CREATE_INSTANT_INVITE", "KICK_MEMBERS", "BAN_MEMBERS", "ADMINISTRATOR", "MANAGE_CHANNELS", "MANAGE_GUILD", "ADD_REACTIONS", "VIEW_AUDIT_LOG", "PRIORITY_SPEAKER", "STREAM", "VIEW_CHANNEL", "SEND_MESSAGES", "SEND_TTS_MESSAGES", "MANAGE_MESSAGES", "EMBED_LINKS", "ATTACH_FILES", "READ_MESSAGE_HISTORY", "MENTION_EVERYONE", "USE_EXTERNAL_EMOJIS", "VIEW_GUILD_INSIGHTS", "CONNECT", "SPEAK", "MUTE_MEMBERS", "DEAFEN_MEMBERS", "MOVE_MEMBERS", "USE_VAD", "CHANGE_NICKNAME", "MANAGE_NICKNAMES", "MANAGE_ROLES", "MANAGE_WEBHOOKS", "MANAGE_EMOJIS"];
const { prompt, AutoComplete, Toggle, Select } = require("enquirer");
const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
let mode = process.argv[2];

if (!["event", "command"].includes(mode)) {
  console.error("Geçersiz mod. Modlar: event, command");
  process.exit(-1);
}

async function permissionPrompt(message = "") {
  let perms = new Set();
  
  async function _do() {
    console.clear();
    let perm = await (new Select({
      limit: 7,
      message: `${message}\n${perms.size ? `${[...perms].join(", ")}\n` : ""}? Yukarı (^) ve Aşağı (v) | Yön oklarını kullanarak seçim yap.`,
      choices: ["[BİTTİ]", ...DISCORD_PERMS.map(i => [...perms].includes(i) ? `- ${i}` : `+ ${i}`)]
    })).run();

    if (perm == "[BİTTİ]") {
      return [...perms];
    } else if (perm.startsWith("+")) {
      perms.add(perm.split(" ")[1]);
      return _do();
    } else if (perm.startsWith("-")) {
      perms.delete(perm.split(" ")[1]);
      return _do();
    }
  }

  return _do();
}

(async () => {
  if (mode == "command") {
    console.clear();
    let name = (await prompt({
      type: "input",
      name: "name",
      message: "Komut dosya ismi ne olsun?",
      validate(name) {
        if (name.endsWith(".js")) name = name.slice(-3);
        return !fs.existsSync(path.resolve("./commands", `${name}.js`));
      },
      required: true
    })).name;
    console.clear();
    let desc = (await prompt({
      type: "input",
      name: "desc",
      message: "Komut açıklaması ne olsun?",
      initial: ""
    })).desc;
    console.clear();
    const developerOnly = await (new Toggle({
      message: "Bu komut geliştiricilere özel mi?",
      enabled: "Evet",
      disabled: "Hayır",
      initial: false
    })).run();
    console.clear();
    const guildOnly = await (new Toggle({
      message: "Bu komut sadece sunuculara özel mi?",
      enabled: "Evet",
      disabled: "Hayır",
      initial: true
    })).run();
    console.clear();
    const usesCoolDown = await (new Toggle({
      message: "Bu komut yavaşlatma kullanıyor mu? (coolDown)",
      enabled: "Evet",
      disabled: "Hayır",
      initial: false
    })).run();

    let coolDown = -1;

    if (usesCoolDown) {
      console.clear();
      coolDown = (await prompt({
        type: "input",
        name: "coolDown",
        message: "Bu komut kaç milisaniye yavaşlatma gerektiriyor? (coolDown, Minimum 0)",
        initial: 1000,
        validate(val) {
          if (isNaN(Number(val))) return false;
          if (Number(val) <= 0) return false;
          return true
        },
        result(val) {
          return parseInt(val);
        }
      })).coolDown;
    }
    console.clear();
    const { aliases } = await prompt({
      type: "input",
      name: "aliases",
      message: "Bu komutun başka yan-isimleri var mı? (aliases, Virgül ile ayır.)",
      initial: "",
      result(val) {
        return val.split(/ ?, ?| /);
      }
    });

    let botPerms = [];
    let userPerms = [];

    if (guildOnly) {
      console.clear();
      if (await (new Toggle({
        message: "Komut çalışması için botta ek yetkilerin olması gerekiyor mu?",
        enabled: "Evet",
        disabled: "Hayır",
        initial: false
      })).run()) {
        console.clear();
        botPerms = await permissionPrompt("Komutun çalışması için bota gerekli olan yetkileri seç.");
      }

      console.clear();
      if (await (new Toggle({
        message: "Bu komutu kullanabilmek için kullanıcının ek yetkilere ihtiyacı var mı?",
        enabled: "Evet",
        disabled: "Hayır",
        initial: false
      })).run()) {
        console.clear();
        userPerms = await permissionPrompt("Bu komutu kullanabilmek için kullanıcıya gerekli olan yetkileri seç.");
      }
    }
    console.clear();

    name = name.replace(/ +/g, "");
    if (name.endsWith(".js")) name = name.slice(-3);
    let filePath = path.resolve("./commands", `${name}.js`);

    console.log(`√ Dosya "${filePath}" konumuna hazırlanıyor!`);
    let t = `module.exports = new Underline.Command({
  onCommand(message, other) {
    // Komut kullanıldığında burası çalışır.
  },
  onLoad(client) {
    // Komut çalışmaya hazır olduğunda çalışır. Opsiyonel silebilirsiniz.
  },
  ${aliases.length != 0 ? `aliases: ${JSON.stringify(aliases)},` : ""}
  ${desc.trim() ? `desc: "${desc.replace(/"/gm, "\\\"")}",` : ""}
  developerOnly: ${developerOnly},
  ${usesCoolDown ? `coolDown: ${coolDown},` : ""}
  guildOnly: ${guildOnly},
  ${botPerms.length != 0 || userPerms.length != 0 ? `perms: {
    ${botPerms.length != 0 ? `bot: ${JSON.stringify(botPerms)},` : ""}
    ${userPerms.length != 0 ? `user: ${JSON.stringify(userPerms)}` : ""}
  },` : ""}
  disabled: false
})`.split("\n").filter(i => !!i.trim()).join("\n");
    console.log(chalk.greenBright(t));
    await fs.promises.writeFile(filePath, t);
    console.log("√ Hazır!");

  } else if (mode == "event") {
    console.clear();
    let { name } = await prompt({
      type: "input",
      name: "name",
      message: "Olay dosya ismi ne olsun?",
      validate(name) {
        if (name.endsWith(".js")) name = name.slice(-3);
        return !fs.existsSync(path.resolve("./events", `${name}.js`));
      },
      required: true
    });
    console.clear();
    let eventName = await (new AutoComplete({
      required: true,
      message: "Discord.js üzerinde hangi olayı dinleyeceksin?",
      name: "eventName",
      limit: 7,
      index: 0,
      choices: ["channelCreate", "channelDelete", "channelPinsUpdate", "channelUpdate", "debug", "warn", "disconnect", "emojiCreate", "emojiDelete", "emojiUpdate", "error", "guildBanAdd", "guildBanRemove", "guildCreate", "guildDelete", "guildUnavailable", "guildIntegrationsUpdate", "guildMemberAdd", "guildMemberAvailable", "guildMemberRemove", "guildMembersChunk", "guildMemberSpeaking", "guildMemberUpdate", "guildUpdate", "inviteCreate", "inviteDelete", "message", "messageDelete", "messageReactionRemoveAll", "messageReactionRemoveEmoji", "messageDeleteBulk", "messageReactionAdd", "messageReactionRemove", "messageUpdate", "presenceUpdate", "rateLimit", "ready", "invalidated", "roleCreate", "roleDelete", "roleUpdate", "typingStart", "userUpdate", "voiceStateUpdate", "webhookUpdate", "shardDisconnect", "shardError", "shardReady", "shardReconnecting", "shardResume"]
    })).run();
    console.clear();
    name = name.replace(/ +/g, "");
    if (name.endsWith(".js")) name = name.slice(-3);
    let filePath = path.resolve("./events", `${name}.js`);

    console.log(`√ Dosya "${filePath}" konumuna hazırlanıyor!`);
    let t = `module.exports = new Underline.Event({
  name: "${name}",
  eventName: "${eventName}",
  onEvent(message) {
    // Olay olduğunda burası çalışır.
  },
  onLoad(client) {
    // Olay çalışmaya hazır olduğunda burası çalışır. Opsiyonel silebilrisiniz.
  },
  disabled: false
});`;
    console.log(chalk.greenBright(t));
    await fs.promises.writeFile(filePath, t);
    console.log("√ Hazır!");
  }
})();
