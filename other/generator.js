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
const makeSureFolderExistsSync = require("stuffs/lib/makeSureFolderExistsSync");
const mode = process.argv[2];

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

makeSureFolderExistsSync("./interactions");
makeSureFolderExistsSync("./events");

(async () => {
  switch (mode) {
    case "interaction": {
      console.clear();
      let interFileName = (await prompt({
        type: "input",
        name: 'value',
        message: "İnteraksiyon dosya adınız ne olsun?",
        result(val) {
          if (val.endsWith(".js")) val = val.slice(0, -3);
          return val;
        },
        required: true
      })).value;
      console.clear();
      let interActionType = (await (new AutoComplete({
        name: 'value',
        message: 'Ne tip bir interaksiyon istiyorsunuz?',
        limit: 10,
        initial: 0,
        choices: [
          "Slash Komut",
          "Üye Sağtık",
          "Mesaj Sağtık"
        ],
        result(val) {
          let l = {
            "Slash Komut": "CHAT_INPUT",
            "Üye Sağtık": "USER",
            "Mesaj Sağtık": "MESSAGE"
          };
          return l[val];
        },
        required: true
      })).run());
      console.clear();

      let interName = [];
      let interDesc = "...";
      switch (interActionType) {
        case "CHAT_INPUT": {
          console.clear();
          interName = (await prompt({
            type: "input",
            name: 'value',
            message: "Slash komutunuz neye banzesin? (Örn; /music ve /music set veya /music set volume)",
            required: true,
            result(val) {
              val = val.trim();
              if (val.startsWith("/")) val = val.slice(1);
              return val.split(" ");
            }
          })).value;

          console.clear();
          interDesc = (await prompt({
            type: "input",
            name: 'value',
            message: "Slash komutunuzun açıklaması ne olsun?",
            required: true
          })).value;
          break;
        };
        case "USER":
        case "MESSAGE": {
          console.clear();
          interName = (await prompt({
            type: "input",
            name: 'value',
            message: "Sağ tıkladığınız yerde ne yazsın? (Örn; Yasakla)",
            required: true
          })).value;
          break;
        }
      }
      console.clear();

      let interDeveloperOnly = await (new Toggle({
        message: "Bu interaksiyon geliştiricilere özel mi?",
        enabled: "Evet",
        disabled: "Hayır",
        initial: false
      })).run();
      console.clear();

      let interGuildOnly = await (new Toggle({
        message: "Bu interaksiyon sadece sunuculara özel mi?",
        enabled: "Evet",
        disabled: "Hayır",
        initial: true
      })).run();
      console.clear();

      let interCoolDown = parseInt((await prompt({
        type: "input",
        name: "value",
        message: "Bu interaksiyon kaç milisaniye yavaşlatma kullanıyor? Kullanmıyorsa 0 koy.",
        initial: "0",
        validate(val) {
          if (isNaN(Number(val))) return false;
          if (Number(val) < 0) return false;
          return true
        }
      })).value);
      console.clear();

      let interBotPerms = [];
      let interUserPerms = [];

      if (interGuildOnly) {
        console.clear();
        if (await (new Toggle({
          message: "Bu interaksiyonun çalışması için botun X yetkilerine ihtiyacı var mı?",
          enabled: "Evet",
          disabled: "Hayır",
          initial: false
        })).run()) {
          console.clear();
          interBotPerms = await permissionPrompt("İnteraksiyionun çalışması için bota gerekli olan yetkileri seç.");
        }

        console.clear();
        if (await (new Toggle({
          message: "Bu interaksiyonu kullanabilmek için kullanıcının X yetkilerine ihtiyacı var mı?",
          enabled: "Evet",
          disabled: "Hayır",
          initial: false
        })).run()) {
          console.clear();
          interUserPerms = await permissionPrompt("Bu interaksiyonu kullanabilmek için kullanıcıya gerekli olan yetkileri seç.");
        }
      }
      console.clear();

      console.log(`! Dosyanız oluşturuluyor..`);

      let filePath = path.resolve("./interactions", `${interFileName}.js`);
      
      let resultText = `
module.exports = new Underline.${interActionType == "CHAT_INPUT" ? "SlashCommand" : interActionType == "USER" ? "UserAction" : interActionType == "MESSAGE" ? "MessageAction" : ""}({
  name: ${JSON.stringify(interName)},
  ${interDesc ? `description: ${JSON.stringify(interDesc)},` : ""}
  onInteraction(inter, other) {
    // Kodunuz buray, kolay gelsin!
  },
  options: [],
  ${interCoolDown ? `coolDown: ${interCoolDown},` : ""}
  guildOnly: ${interGuildOnly},
  developerOnly: ${interDeveloperOnly}${interBotPerms.length > 0 || interUserPerms.length > 0 ? `,` : ""}
  ${interBotPerms.length > 0 || interUserPerms.length > 0 ? `perms: {` : ""}
  ${interBotPerms.length > 0 ? `  bot: ${JSON.stringify(interBotPerms)},` : ""}
  ${interUserPerms.length > 0 ? `  user: ${JSON.stringify(interUserPerms)}` : ""}
  ${interBotPerms.length > 0 || interUserPerms.length > 0 ? `}` : ""}
});
      `.split("\n").filter(i => !!i.trim()).join("\n");
      
      console.log(chalk.blueBright(resultText));
      fs.writeFileSync(filePath, resultText, "utf8");
      console.log(`! Dosyanız "${chalk.green(filePath)}" konumuna kaydedildi!`);
      break;
    }
    case "event": {
      console.clear();
      let eventFileName = (await prompt({
        type: "input",
        name: 'value',
        message: "Olay dosya adınız ne olsun?",
        result(val) {
          if (val.endsWith(".js")) val = val.slice(0, -3);
          return val;
        },
        required: true
      })).value;
      console.clear();
      let eventName = await (new AutoComplete({
        required: true,
        message: "Hangi olayı dinleyeceksiniz?",
        name: "value",
        limit: 10,
        index: 0,
        choices: ["applicationCommandCreate", "applicationCommandDelete", "applicationCommandUpdate", "channelCreate", "channelDelete", "channelPinsUpdate", "channelUpdate", "debug", "emojiCreate", "emojiDelete", "emojiUpdate", "error", "guildBanAdd", "guildBanRemove", "guildCreate", "guildDelete", "guildIntegrationsUpdate", "guildMemberAdd", "guildMemberAvailable", "guildMemberRemove", "guildMembersChunk", "guildMemberUpdate", "guildUnavailable", "guildUpdate", "interaction", "interactionCreate", "invalidated", "invalidRequestWarning", "inviteCreate", "inviteDelete", "message", "messageCreate", "messageDelete", "messageDeleteBulk", "messageReactionAdd", "messageReactionRemove", "messageReactionRemoveAll", "messageReactionRemoveEmoji", "messageUpdate", "presenceUpdate", "rateLimit", "ready", "roleCreate", "roleDelete", "roleUpdate", "shardDisconnect", "shardError", "shardReady", "shardReconnecting", "shardResume", "stageInstanceCreate", "stageInstanceDelete", "stageInstanceUpdate", "stickerCreate", "stickerDelete", "stickerUpdate", "threadCreate", "threadDelete", "threadListSync", "threadMembersUpdate", "threadMemberUpdate", "threadUpdate", "typingStart", "userUpdate", "voiceStateUpdate", "warn", "webhookUpdate"]
      })).run();
      console.clear();

      console.log(`! Dosyanız oluşturuluyor..`);

      let filePath = path.resolve("./events", `${eventFileName}.js`);

      let resultText = `
module.exports = new Underline.Event({
  eventName: "${eventName}",
  onEvent(...args) {
    // Kodunuz buraya, kolay gelsin!
  }
});
      `.split("\n").filter(i => !!i.trim()).join("\n");

      console.log(chalk.blueBright(resultText));
      fs.writeFileSync(filePath, resultText, "utf8");
      console.log(`! Dosyanız "${chalk.green(filePath)}" konumuna kaydedildi!`);

      break;
    }
    default: {
      console.error("Geçersiz seçenek girdiniz! Geçerli seçenekler: interaction, event");
      break;
    }
  }
})();
