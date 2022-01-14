require("./other/patchConsoleLog");
const { plsParseArgs } = require('plsargs');
const argv = plsParseArgs(process.argv.slice(2));
const chillout = require("chillout");
const { makeSureFolderExists, sleep } = require("stuffs");
const path = require("path");
const readdirRecursive = require("recursive-readdir");
const config = require("./config");
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const Discord = require('discord.js');

globalThis.Underline = {
  config,
  Interaction: require('./types/Interaction'),
  Event: require('./types/Event'),
  SlashCommand: require("./types/SlashCommand"),
  MessageAction: require("./types/MessageAction"),
  UserAction: require("./types/UserAction"),
  SelectMenu: require("./types/SelectMenu"),
  Button: require("./types/Button"),
  Locale: require("./types/Locale"),
};

(async () => {

  let dcInters = [];

  let isClearMode = argv.get(0) == "guild" ? argv.get(2) == "clear" : (argv.get(0) == "global" ? argv.get(1) == "clear" : false);

  let publishMode = argv.get(0) == "guild" ? "guild" : argv.get(0) == "global" ? "global" : null;

  let publishSpecialType = publishMode == "guild" ? (isClearMode ? "guildOnly" : (argv.get(2) || "guildOnly")) : "globalOnly";



  if (!publishMode) {
    console.error(`Geçersiz paylaşım modu! Geçerli modlar: guild, global`);
    console.error(`Kullanım örneği: node publishInteractions.js guild <guildId> [clear]`);
    console.error(`Kullanım örneği: node publishInteractions.js global [clear]`);
    return process.exit(1);
  }

  if (!isClearMode) {
    let interactionsFolder = path.resolve("./interactions");

    await makeSureFolderExists(interactionsFolder);

    /** @type {(import("./types/Interaction"))[]} */
    let uInters = [];

    console.info("Interaksiyon dosyaları okunuyor..")

    let interactionFilePaths = await readdirRecursive(interactionsFolder);
    interactionFilePaths = interactionFilePaths.filter(i => {
      let state = path.basename(i).startsWith("-");
      return !state;
    });

    await chillout.forEach(interactionFilePaths, (interactionFilePath) => {
      /** @type {import("./types/Interaction")} */
      let uInter = require(interactionFilePath);
      if(uInter?._type != "interaction") return;
      if (!uInter.publishType) uInter.publishType = "all";
      if (!(uInter.publishType == "all" || publishSpecialType == uInter.publishType)) {
        console.warn(`Interaksiyon "${uInter.actionType == "CHAT_INPUT" ? `/${uInter.name.join(" ")}` : `${uInter.name[0]}`}" dönüştürülme listesine eklenmedi çünkü interaksiyon paylaşılma tipi(${uInter.publishType}) ile paylaşma modu(${publishMode}) uyumsuz!`);
        return;
      }
      console.info(`Interaksiyon "${uInter.actionType == "CHAT_INPUT" ? `/${uInter.name.join(" ")}` : `${uInter.name[0]}`}" dönüştürülme listesine eklendi!`);
      uInters.push(uInter);
    });

    console.info("Interaksiyonlar discordun anlayacağı dile dönüştürülüyor..")
    uInters = uInters.sort((a, b) => a.name.length - b.name.length)

    dcInters = uInters.reduce((all, current) => {
      switch (current.name.length) {
        case 1: {
          all.push({
            type: current.actionType,
            name: current.name[0],
            description: current.description,
            defaultPermission: current.defaultPermission,
            options: current.options
          });
          break;
        }
        case 2: {
          let baseItem = all.find((i) => {
            return i.name == current.name[0] && i.type == current.actionType
          });
          if (!baseItem) {
            all.push({
              type: current.actionType,
              name: current.name[0],
              description: `${current.name[0]} komutları.`,
              defaultPermission: current.defaultPermission,
              options: [
                {
                  type: "SUB_COMMAND",
                  description: current.description,
                  name: current.name[1],
                  options: current.options
                }
              ]
            });
          } else {
            baseItem.options.push({
              type: "SUB_COMMAND",
              description: current.description,
              name: current.name[1],
              options: current.options
            })
          }
          break;
        }
        case 3: {
          let level1Item = all.find((i) => {
            return i.name == current.name[0] && i.type == current.actionType
          });
          if (!level1Item) {
            all.push({
              type: current.actionType,
              name: current.name[0],
              description: `${current.name[0]} komutları.`,
              defaultPermission: current.defaultPermission,
              options: [
                {
                  type: "SUB_COMMAND_GROUP",
                  description: `${current.name[1]} komutları.`,
                  name: current.name[1],
                  options: [
                    {
                      type: "SUB_COMMAND",
                      description: current.description,
                      name: current.name[2],
                      options: current.options
                    }
                  ]
                }
              ]
            });
          } else {
            let level2Item = level1Item.options.find(i => {
              return i.name == current.name[1] && i.type == "SUB_COMMAND_GROUP"
            });
            if (!level2Item) {
              level1Item.options.push({
                type: "SUB_COMMAND_GROUP",
                description: `${current.name[1]} komutları.`,
                name: current.name[1],
                options: [
                  {
                    type: "SUB_COMMAND",
                    description: current.description,
                    name: current.name[2],
                    options: current.options
                  }
                ]
              })
            } else {
              level2Item.options.push({
                type: "SUB_COMMAND",
                description: current.description,
                name: current.name[2],
                options: current.options
              })
            }
          }
        }
          break;
      }

      return all;
    }, []);
    
    dcInters = dcInters.map(i => Discord.ApplicationCommandManager.transformCommand(i));
  } else {
    console.info("Hiçbir interaksiyon okunmadı, bütün var olanlar temizlenicek...");
  }

  const rest = new REST({ version: "9" }).setToken(config.clientToken);

  console.info("Hesap bilgileri alınıyor!");
  /** @type {import("discord-api-types/rest/v9/user").RESTGetAPIUserResult} */
  const me = await rest.get(Routes.user());
  console.info(`Hesap bilgileri alındı! ${me.username}#${me.discriminator} (${me.id})`);

  console.info(`İnteraksiyonlar discorda gönderiliyor!`);

  switch (publishMode) {
    case "guild": {
      let guildId = argv.get(1);
      console.info(`Paylaşma modu: sunucu (${guildId})`);

      await rest.put(Routes.applicationGuildCommands(me.id, guildId), { body: dcInters });

      console.info(`Paylaşılan komutların gelmesi 3-5 saniye kadar sürebilir.`);
      break;
    }
    case "global": {
      console.info(`Paylaşma modu: global`);

      await rest.put(Routes.applicationCommands(me.id), { body: dcInters });

      console.info(`Paylaşılan komutların gelmesi 1 saat kadar sürebilir. Eğer hemen gelmesini istiyorsanız botunuzu sunucunuzdan atıp geri alabilirsiniz.`);
      break;
    }
  }

  console.info(`İnteraksiyonlar paylaşıldı!`);
})();
