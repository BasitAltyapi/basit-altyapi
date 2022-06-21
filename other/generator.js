require("./patchConsoleLog");

try {
  require("enquirer");
} catch {
  console.warn("Bu işlemi yapmadan önce gerekli modülleri indirmeniz gerekiyor.")
  console.warn("-> yarn install");
  process.exit(-1);
}

const DISCORD_PERMS = ["CreateInstantInvite", "KickMembers", "BanMembers", "Administrator", "ManageChannels", "ManageGuild", "AddReactions", "ViewAuditLog", "PrioritySpeaker", "Stream", "ViewChannel", "SendMessages", "SendTtsMessages", "ManageMessages", "EmbedLinks", "AttachFiles", "ReadMessageHistory", "MentionEveryone", "UseExternalEmojis", "ViewGuildInsights", "Connect", "Speak", "MuteMembers", "DeafenMembers", "MoveMembers", "UseVad", "ChangeNickname", "ManageNicknames", "ManageRoles", "ManageWebhooks", "ManageEmojis"];
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
          "Mesaj Sağtık",
          "Seç Menüsü",
          "Form",
          "Buton"
        ],
        result(val) {
          let l = {
            "Slash Komut": "ChatInput",
            "Üye Sağtık": "User",
            "Mesaj Sağtık": "Message",
            "Seç Menüsü": "SelectMenu",
            "Form": "Modal",
            "Buton": "Button"
          };
          return l[val];
        },
        required: true
      })).run());
      console.clear();

      let interName = [];
      let interDesc = "...";
      switch (interActionType) {
        case "ChatInput": {
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
        case "User":
        case "Message": {
          console.clear();
          interName = (await prompt({
            type: "input",
            name: 'value',
            message: "Sağ tıkladığınız yerde ne yazsın? (Örn; Yasakla)",
            required: true
          })).value;
          break;
        }
        case "Button": {
          console.clear();
          interName = (await prompt({
            type: "input",
            name: 'value',
            message: "Butonunuzun custom id'si ne olsun? (Örn; bas_bana)",
            required: true
          })).value;
          break;
        }
        case "SelectMenu": {
          console.clear();
          interName = (await prompt({
            type: "input",
            name: 'value',
            message: "Menünüzün custom id'si ne olsun? (Örn; sec_beni)",
            required: true
          })).value;
          break;
        }
        case "Modal": {
          console.clear();
          interName = (await prompt({
            type: "input",
            name: 'value',
            message: "Formunuzun custom id'si ne olsun? (Örn; doldur_beni)",
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

      let interGuildOwnerOnly;
      if (interGuildOnly) interGuildOwnerOnly = await (new Toggle({
        message: "Bu interaksiyon sunucu sahibine özel mi?",
        enabled: "Evet",
        disabled: "Hayır",
        initial: false
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
      if (interDeveloperOnly) interUserPerms.push("Developer");
      if (interGuildOwnerOnly) interUserPerms.push("GuildOwner");
      console.clear();

      console.log(`! Dosyanız oluşturuluyor..`);
      let transformer = { "User": "UserAction", "Message": "MessageAction" }
      let filePath = path.resolve("./interactions", `${interFileName}.js`);
      let resultText = `
module.exports = new Underline.${transformer[interActionType] || interActionType || ""}({
  ${interActionType == "Button" || interActionType == "SelectMenu" || interActionType == "Modal" ? `id: ${JSON.stringify(interName)},` : ""}
  name: ${JSON.stringify(interName)},
  ${interDesc ? `description: ${JSON.stringify(interDesc)},` : ""}
  async onInteraction(inter, other) {
    // Kodunuz bruh, kolay gelsin!
  },
  ${interActionType == "Message" || interActionType == "User" ? "" : `options: ${interActionType == "Button" || interActionType == "SelectMenu"|| interActionType == "Modal" ? "{}" : "[]"},`}
  ${interCoolDown ? `coolDown: ${interCoolDown},` : ""}
  ${interActionType == "Message" || interActionType == "User" ? "publishType: \"all\"," : ""}
  guildOnly: ${interGuildOnly}${interBotPerms.length > 0 || interUserPerms.length > 0 ? `,` : ""}
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
  async onEvent(...args) {
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
