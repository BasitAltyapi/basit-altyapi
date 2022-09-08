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
  ChatInput: require("./types/ChatInput"),
  MessageAction: require("./types/MessageAction"),
  UserAction: require("./types/UserAction"),
  SelectMenu: require("./types/SelectMenu"),
  Button: require("./types/Button"),
  Locale: require("./types/Locale"),
  Modal: require("./types/Modal"),
};

globalThis.Enums = {
  ChannelType: Discord.ChannelType,
  MessageType: Discord.MessageType,
  ApplicationCommandOptionType: Discord.ApplicationCommandOptionType,
  ActivityType: Discord.ActivityType,
  AuditLogOptionsType: Discord.AuditLogOptionsType,
  InteractionType: Discord.InteractionType,
  ComponentType: Discord.ComponentType,
  ButtonStyle: Discord.ButtonStyle,
  TextInputStyle: Discord.TextInputStyle
}

let ogLangs = ["da", "de", "en-GB", "en-US", "es-ES", "fr", "hr", "it", "lt", "hu", "nl", "no", "pl", "pt-BR", "ro", "fi", "sv-SE", "vi", "tr", "cs", "el", "bg", "ru", "uk", "hi", "th", "zh-CN", "ja", "zh-TW", "ko"];



let interactionTypes = { "ChatInput": 1, "Message": 3, "User": 2 };
let optionTypes = { "SubCommand": 1, "SubCommandGroup": 2, "String": 3, "Integer": 4, "Boolean": 5, "User": 6, "Channel": 7, "Role": 8, "Mentionable": 9, "Number": 10, "Attachment": 11 };

async function getLocaleFilePaths() {
  let localesPath = path.resolve("./locales");
  await makeSureFolderExists(localesPath);
  let VLocaleFiles = await readdirRecursive(localesPath);
  VLocaleFiles = VLocaleFiles.filter(i => {
    let state = path.basename(i).startsWith("-");
    return !state;
  });
  return VLocaleFiles;
}

/** @type {[import("./types/Locale").LocaleString, import("./types/Locale").Locale][]} */
const locales = [];

(async () => {

  await chillout.forEach(await getLocaleFilePaths(), (localeFile) => {
    let locale = require(localeFile);
    if (locale._type != "locale") return;
    locales.push([locale.locale, locale]);
  })


  let dcInters = [];

  let isClearMode = argv.get(0) == "guild" ? argv.get(2) == "clear" : (argv.get(0) == "global" ? argv.get(1) == "clear" : false);

  let publishMode = argv.get(0) == "guild" ? "guild" : argv.get(0) == "global" ? "global" : null;

  let publishSpecialType = publishMode == "guild" ? (isClearMode ? "guildOnly" : (argv.get(2) || "guildOnly")) : "globalOnly";

  console.log(publishSpecialType)

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

    let plFilePaths = await readdirRecursive(path.resolve("./plugins"));

    let plInteractionsPaths = plFilePaths.filter(i => {
      if (!i.match(new RegExp(`plugins\\${path.sep}(.|[şçğüiÇŞİĞÜIıöÖ])*\\${path.sep}interactions`))?.length) return false;
      if (i.match(new RegExp(`plugins\\${path.sep}-(.|[şçğüiÇŞİĞÜIıöÖ])*\\${path.sep}interactions`))?.length) return false;
      let state = path.basename(i).startsWith("-");
      return !state;
    });

    interactionFilePaths = [...interactionFilePaths, ...plInteractionsPaths];

    await chillout.forEach(interactionFilePaths, (interactionFilePath) => {
      /** @type {import("./types/Interaction")} */
      let uInter = require(interactionFilePath);
      if (uInter?._type != "interaction") return;
      if (!uInter.publishType) uInter.publishType = "globalOnly";
      if (!((uInter.publishType == "all" && ["guildOnly", "globalOnly"].includes(publishSpecialType)) || publishSpecialType == uInter.publishType)) {
        console.warn(`Interaksiyon "${uInter.actionType == "ChatInput" ? `/${uInter.name.join(" ")}` : `${uInter.name[0]}`}" dönüştürülme listesine eklenmedi çünkü interaksiyon paylaşılma tipi(${uInter.publishType}) ile paylaşma modu(${publishMode}) uyumsuz!`);
        return;
      }
      console.info(`Interaksiyon "${uInter.actionType == "ChatInput" ? `/${uInter.name.join(" ")}` : `${uInter.name[0]}`}" dönüştürülme listesine eklendi!`);
      uInters.push(uInter);
    });

    console.info("Interaksiyonlar discordun anlayacağı dile dönüştürülüyor..")
    uInters = uInters.sort((a, b) => a.name.length - b.name.length)

    dcInters = uInters.reduce((all, current) => {
      switch (current.name.length) {
        case 1: {
          let localeData = findLocales(current.name);
          all.push({
            type: interactionTypes[current.actionType] ?? current.actionType,
            name: current.name[0],
            description: current.description,
            defaultMemberPermissions: current.defaultPermission ? null : ["Administrator"],
            dmPermission: !current.guildOnly,
            options: current.options,
            nameLocalizations: localeData.names(0),
            descriptionLocalizations: localeData.descriptions,
          });
          break;
        }
        case 2: {
          let baseItem = all.find((i) => {
            return i.name == current.name[0] && (interactionTypes[i.type] ?? i.type) == (interactionTypes[current.actionType] ?? current.actionType)
          });
          let localeData = findLocales(current.name);
          if (!baseItem) {
            all.push({
              type: interactionTypes[current.actionType] ?? current.actionType,
              name: current.name[0],
              nameLocalizations: localeData.names(0),
              descriptionLocalizations: localeData.descriptions,
              description: current.description,
              defaultMemberPermissions: current.defaultPermission ? null : ["Administrator"],
              dmPermission: !current.guildOnly,
              options: [
                {
                  type: 1,
                  description: current.description,
                  name: current.name[1],
                  nameLocalizations: localeData.names(1),
                  descriptionLocalizations: localeData.descriptions,
                  options: current.options
                }
              ]
            });
          } else {
            baseItem.options.push({
              type: 1,
              description: current.description,
              name: current.name[1],
              nameLocalizations: localeData.names(1),
              descriptionLocalizations: localeData.descriptions,
              options: current.options
            })
          }
          break;
        }
        case 3: {
          let level1Item = all.find((i) => {
            return i.name == current.name[0] && (interactionTypes[i.type] ?? i.type) == (interactionTypes[current.actionType] ?? current.actionType)
          });
          let localeData = findLocales(current.name);
          if (!level1Item) {
            all.push({
              type: interactionTypes[current.actionType] ?? current.actionType,
              name: current.name[0],
              defaultMemberPermissions: current.defaultPermission ? null : ["Administrator"],
              dmPermission: !current.guildOnly,
              nameLocalizations: localeData.names(0),
              descriptionLocalizations: localeData.descriptions,
              description: current.description,
              options: [
                {
                  type: 2,
                  name: current.name[1],
                  nameLocalizations: localeData.names(1),
                  descriptionLocalizations: localeData.descriptions,
                  description: current.description,
                  options: [
                    {
                      type: 1,
                      description: current.description,
                      name: current.name[2],
                      options: current.options,
                      nameLocalizations: localeData.names(2),
                      descriptionLocalizations: localeData.descriptions,
                    }
                  ]
                }
              ]
            });
          } else {
            let level2Item = level1Item.options.find(i => {
              return i.name == current.name[1] && (interactionTypes[i.type] ?? i.type) == 2
            });
            if (!level2Item) {
              level1Item.options.push({
                type: 2,
                name: current.name[1],
                nameLocalizations: localeData.names(1),
                descriptionLocalizations: localeData.descriptions,
                description: current.description,
                options: [
                  {
                    type: 1,
                    description: current.description,
                    name: current.name[2],
                    options: current.options,
                    nameLocalizations: localeData.names(2),
                    descriptionLocalizations: localeData.descriptions,
                  }
                ]
              })
            } else {
              level2Item.options.push({
                type: 1,
                description: current.description,
                name: current.name[2],
                options: current.options,
                nameLocalizations: localeData.names(2),
                descriptionLocalizations: localeData.descriptions,
              })
            }
          }
        }
          break;
      }

      return all;
    }, []);

    function fixOptions(inter = {}) {
      inter.type = optionTypes[inter.type] ?? inter.type;
      if (inter?.options) {
        inter.options.map(fixOptions)
        return inter;
      };
      return inter;
    }

    for (let i = 0; i < dcInters.length; i++) {
      dcInters[i] = fixOptions(dcInters[i]);
    }

    require("util").inspect(dcInters, false, 9999, true)

    // return;

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


/**
 * @param {string[]} commandName 
 */
function findLocales(commandName) {
  let commandNameJoined = commandName.join(" ");
  let descriptions = {};
  let names = {};
  for (let i = 0; i < locales.length; i++) {
    const [localeString, locale] = locales[i];
    let commandLocale = locale.commands.find(i => i.originalName.join(" ") == commandNameJoined);
    if (commandLocale) {
      let aliases = ogLangs.filter(i => i.startsWith(localeString));
      for (let j = 0; j < aliases.length; j++) {
        const alias = aliases[j];
        descriptions[alias] = commandLocale.description;
        names[alias] = commandLocale.name;
      }
    }
  }
  return {
    descriptions,
    names(idx) {
      return Object.fromEntries(Object.entries(names).map(i => [i[0], i[1][idx]]));
    }
  };
}
