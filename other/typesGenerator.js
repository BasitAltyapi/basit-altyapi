require("./patchConsoleLog");

const chillout = require("chillout");
const fs = require("fs");
const extractZip = require("extract-zip");
const { makeSureFolderExists } = require("stuffs");
const path = require("path");
const readdirRecursive = require("recursive-readdir");
const config = require("../config");
const { Collection, ChannelType, MessageType, ComponentType, InteractionType, ActivityType, AuditLogOptionsType, ApplicationCommandOptionType, ButtonStyle, TextInputStyle } = require("discord.js");

globalThis.Underline = {
  Plugin: require("../types/Plugin"),
  Interaction: require('../types/Interaction'),
  Event: require('../types/Event'),
  ChatInput: require("../types/ChatInput"),
  MessageAction: require("../types/MessageAction"),
  UserAction: require("../types/UserAction"),
  SelectMenu: require("../types/SelectMenu"),
  Button: require("../types/Button"),
  Locale: require("../types/Locale"),
  Modal: require("../types/Modal"),
  config
};

globalThis.Enums = {
  ChannelType,
  MessageType,
  ApplicationCommandOptionType,
  ActivityType,
  AuditLogOptionsType,
  InteractionType,
  ComponentType,
  ButtonStyle,
  TextInputStyle
}

async function getEventFilePaths() {
  let eventsPath = path.resolve("./events");
  await makeSureFolderExists(eventsPath);
  let VEventFiles = await readdirRecursive(eventsPath);
  VEventFiles = VEventFiles.filter(i => {
    let state = path.basename(i).startsWith("-");
    return !state;
  });
  return VEventFiles;
}

async function getLocaleFilePaths() {
  let localesPath = path.resolve("./locales");
  await makeSureFolderExists(localesPath);
  let VLocaleFiles = await readdirRecursive(localesPath);

  return VLocaleFiles;
}

async function getInteractionFilePaths() {
  let interactionsPath = path.resolve("./interactions");
  await makeSureFolderExists(interactionsPath);
  let VInteractionFiles = await readdirRecursive(interactionsPath);
  VInteractionFiles = VInteractionFiles.filter(i => {
    let state = path.basename(i).startsWith("-");
    return !state;
  });
  return VInteractionFiles;
}

(async () => {
  let pluginFiles = await getPluginFilePaths();
  let eventFiles = await getEventFilePaths();
  let interactionFiles = await getInteractionFilePaths();
  let pluginTypes = [];
  let pluginConfigTypes = [];
  let interactionIds = [];
  let eventIds = [];
  let TEventNames = [];
  let TEvents = [];
  let TInterfaces = [];
  let loadedNamespaces = [];

  localeFiles = await getLocaleFilePaths();

  const locales = new Collection();

  await chillout.forEach(localeFiles, (localeFile) => {
    /** @type {import("./types/Locale")} */
    let locale = require(localeFile);
    locale.path = localeFile;
    locales.set(locale.locale, locale);
  });

  {
    let configOtherType = {};
    delete Underline.config.other.plugins;
    function fixConfigIn(fixingObj, tempObj) {
      for (let key in fixingObj) {
        if (typeof fixingObj[key] != "object") {
          tempObj[key] = typeof fixingObj[key];
          configEdit = true;
        }
        else if (typeof fixingObj[key] == "object") {
          tempObj[key] = {};
          fixConfigIn(fixingObj[key], tempObj[key]);
        }
      }
    }
    fixConfigIn(Underline.config.other, configOtherType);
    configOtherType["plugins"] = "import('./pluginTypes').config";
    fs.writeFileSync(path.resolve(__dirname, "../generated/configOther.d.ts"), `export default class Other ${JSON.stringify(configOtherType, null, 2).replace(/("([^"]*[^\\]?)")/g, "$2").replace(/,$/mg, ";")}`);
  };

  await chillout.forEach(pluginFiles, async (pluginFile) => {
    /** @type {import("../types/Plugin")} */
    let plugin = require(pluginFile);

    if (plugin._type != "plugin") return

    if (loadedNamespaces.find(x => x == plugin.namespace)) return

    loadedNamespaces.push(plugin.namespace);

    let parsedPluginPath = path.parse(pluginFile);

    let dtsPath = "";

    switch (parsedPluginPath.dir.split(path.sep).pop()) {
      case "plugins": {
        dtsPath = path.resolve(parsedPluginPath.dir, parsedPluginPath.base.replace(".up.js", ".up.d.ts"));
        break;
      }
      default: {
        dtsPath = path.resolve(parsedPluginPath.dir, "index.d.ts");
        break;
      }
    }

    let isDTS = fs.existsSync(dtsPath);

    if (isDTS) {
      pluginTypes.push(`["${plugin.namespace}"]: import("${path.relative(process.cwd(), dtsPath).replace(".d.ts", "").replaceAll(path.sep, "/")}").Plugin`);
    } else {
      if (!plugin?.implements?.properties) return;
      let result = []
      for (let property in plugin.implements.properties) {
        let returns = plugin.implements.properties[property];
        let returnsString = generateReturn(returns);
        result.push(`${property}: ${returnsString}`)
      }
      result = `{ ${result.join(", ")} }`;
      pluginTypes.push(`["${plugin.namespace}"]: ${result}`);
    }

    if (plugin?.implements?.events) {
      for (let eventName in plugin.implements.events) {
        let args = plugin.implements.events[eventName].split(/ *, */).map(x => x.includes(":") ? (x.split(":")[0] + ":" + generateReturn(x.split(":")[1])) : generateReturn(x));
        TEventNames.push(`"${plugin.namespace}:${eventName}"`);
        args.push("other: IOther");
        TInterfaces.push(`export interface ${plugin.namespace}_${eventName.replace(/ |-/, "")} { eventName: "${plugin.namespace}:${eventName}", onEvent: (${!args?.[0] ? "" : args.map((v, i) => v.includes(":") ? v : `arg${i}: ${v}`).join(", ")}) => void }`);
        TEvents.push(`${plugin.namespace}_${eventName.replace(/ |-/, "")}`);

      }
    }

    if (plugin.locale) {
      locales.forEach((locale) => {
        if (!locale.inConstructor) locale.inConstructor = { locale: locale.locale, data: locale._data, commands: locale.commands };
        if (!locale.inConstructor.data[plugin.namespace]) {
          locale.inConstructor.data[plugin.namespace] = plugin.locale;
          locale.overwrite = true;
        } else {
          function fixO(fixingObj, tempObj) {
            for (let key in tempObj) {
              if (!fixingObj[key]) {
                fixingObj[key] = tempObj[key];
                locale.overwrite = true;
              }
              else if (typeof fixingObj[key] == "object") fixO(fixingObj[key], tempObj[key]);
            }
          }
          fixO(locale.inConstructor.data[plugin.namespace], plugin.locale);
        }
      })
    }

    if (plugin.requires.config) {
      let result = []
      for (let property in plugin.requires.config) {
        let returns = plugin.requires.config[property];
        let returnsString = generateReturn(returns);
        result.push(`${property}: ${returnsString}`)
      }
      result = `{ ${result.join(", ")} }`;
      pluginConfigTypes.push(`["${plugin.namespace}"]: ${result}`);
    }

  });

  let defaultLocale = locales.get(Underline.config.defaultLanguage);

  locales.forEach((locale) => {
    if (!locale.inConstructor) locale.inConstructor = { locale: locale.locale, data: locale._data, commands: locale.commands };

    // function commentThemAll(fixingObj, tempObj) {
    //   for (let key in tempObj) {
    //     if (!fixingObj[key]) {
    //       if (typeof tempObj[key] == "string") {
    //         fixingObj[key] = "";
    //         if (!locale.comments) locale.comments = {};
    //         locale.comments[key] = tempObj[key]
    //       }

    //       locale.overwrite = true;
    //     }
    //     else if (typeof fixingObj[key] == "object") fillDataWithDefault(fixingObj[key], tempObj[key]);
    //   }
    // }
    let lastTriggers = [];

    function fillDataWithDefaultWithComment(fixingObj, tempObj) {
      for (let key in tempObj) {
        if (!fixingObj[key]) {
          if (typeof tempObj[key] == "string") {
            fixingObj[key] = "";
            if (!locale.comments) locale.comments = {};
            locale.comments[key] = tempObj[key]
          } else if (typeof tempObj[key] == "object") {
            if (!locale.comments) locale.comments = {};
            fixingObj[key] = tempObj[key];
            fillDataWithDefaultWithComment(fixingObj[key], tempObj[key]);
          }
          locale.overwrite = true;
        } else if (typeof fixingObj[key] == "object") fillDataWithDefaultWithComment(fixingObj[key], tempObj[key]);
        else if (typeof fixingObj[key] == "string") {
          locale.comments[key] = tempObj[key]
          fixingObj[key] = "";
        }
      }
    }

    function fillDataWithDefault(fixingObj, tempObj) {
      for (let key in tempObj) {
        if (!fixingObj[key] && fixingObj[key] !== "") {
          if (typeof tempObj[key] == "string") {
            fixingObj[key] = "";
            if (!locale.comments) locale.comments = {};
            locale.comments[key] = tempObj[key]
          } else if (typeof tempObj[key] == "object") {
            if (!locale.comments) locale.comments = {};
            fixingObj[key] = tempObj[key];
            lastTriggers.push({ f: fillDataWithDefaultWithComment, args: [fixingObj[key], tempObj[key]]});
          }
          locale.overwrite = true;
        } else if (typeof fixingObj[key] == "object") fillDataWithDefault(fixingObj[key], tempObj[key]);
      }
    }
    fillDataWithDefault(locale.inConstructor.data, defaultLocale._data);
    lastTriggers.forEach((obj) => obj.f(...obj.args));
  });

  locales.forEach(locale => {
    if (locale.overwrite) {
      locale.inConstructor = JSON.stringify(locale.inConstructor, null, 2).replace(/("([^"]*[^\\]?)"|`([^`]*[^\\]?)`|'([^']*[^\\]?)')\:/g, "$2$4$3:");
      if (locale.comments) for (let key in locale.comments) {
        locale.inConstructor = locale.inConstructor.replace(new RegExp(`( *)(${key}: ")`), `$1// ${locale.comments[key]}\n$1$2`)
      }
      fs.writeFileSync(locale.path, `module.exports = new Underline.Locale(${locale.inConstructor});`);
    }
  });



  if (defaultLocale) {

    let localeData = JSON.stringify(defaultLocale._data, null, 2).replace(/("([^"]*[^\\]?)"|`([^`]*[^\\]?)`|'([^']*[^\\]?)')\:/g, "$2$4$3:").replace(/"[^"]*[^\\]?"|`[^`]*[^\\]?`|'[^']*[^\\]?'/g, "(...args) => string");

    let localeOutput =
      `export default class Locale {
  locale: import("../types/Locale").LocaleString
  data: LocaleData
}
  
export type LocaleData = ${localeData};`;
    await fs.promises.writeFile(path.resolve(__dirname, "../generated/localeTypes.d.ts"), localeOutput);
  }

  await chillout.forEach(interactionFiles, (interactionFile) => {
    /** @type {import("..MessageActions/Interaction")} */
    let uInter = require(interactionFile);

    if (!uInter?._type?.toLowerCase().includes("interaction")) return;

    if (!uInter.id) return;
    interactionIds.push(uInter.id);

  });

  await chillout.forEach(eventFiles, (eventFile) => {
    /** @type {import("../types/Event")} */
    let uEvent = require(eventFile);
    if (uEvent?._type != "event") return;
    if (typeof uEvent.id != "string") uEvent.id = path.basename(eventFile).slice(0, -3).replace(/ /g, "");
    eventIds.push(uEvent.id);
  });

  await makeSureFolderExists(path.resolve(__dirname, "../generated"));
  let pluginTypesResult = `import { IOther } from "../types/Event";\n\nexport class config {\n${pluginConfigTypes.map(i => `  ${i};`).join("\n")}\n}\n\nexport class Types {\n${pluginTypes.map(i => `  ${i};`).join("\n")}\n};\n${`export type TEventNames = ${TEventNames.join(" | ").trim() || '""'};`}\n${`export type TEvents = ${TEvents.join(" | ").trim() || "[]"};`}\n${TInterfaces.join("\n")}\n`.trim();
  await fs.promises.writeFile(path.resolve(__dirname, "../generated/pluginTypes.d.ts"), pluginTypesResult);

  let idsResult = `export type InteractionIds = ${interactionIds.map(i => `"${i}"`).join(" | ").trim() || '""'};\nexport type EventIds = ${eventIds.map(i => `"${i}"`).join(" | ").trim() || '""'};`;
  await fs.promises.writeFile(path.resolve(__dirname, "../generated/ids.d.ts"), idsResult);

})();

function generateReturn(returns) {
  let returnsString = "";
  switch (returns) {
    case "function": {
      returnsString = "(...args: any[]) => any";
      break;
    }
    case "object": {
      returnsString = "{ [key:string|number]: any }";
      break;
    }
    case "array": {
      returnsString = "any[]";
      break;
    }
    default: {
      returnsString = returns;
    }
  }
  return returnsString;
}

async function getPluginFilePaths() {
  let pluginsPath = path.resolve(__dirname, "../plugins");
  await makeSureFolderExists(pluginsPath);
  let folderOrZips = await fs.promises.readdir(pluginsPath, { withFileTypes: true });
  let result = [];
  for (let i = 0; i < folderOrZips.length; i++) {
    const folderOrZip = folderOrZips[i];
    if (folderOrZip.isDirectory() && folderOrZip.name.endsWith(".up")) {
      if (folderOrZip.name.startsWith("-")) continue;
      result.push(path.resolve(pluginsPath, folderOrZip.name, "index.js"));
    } else if (folderOrZip.name.endsWith(".up.js")) {
      if (folderOrZip.name.startsWith("-")) continue;
      result.push(path.resolve(pluginsPath, folderOrZip.name));
    } else if (folderOrZip.name.endsWith(".up.zip")) {
      let folderPath = path.resolve(pluginsPath, folderOrZip.name.replace(".up.zip", ".up"));
      let zipPath = path.resolve(pluginsPath, folderOrZip.name);

      await fs.promises.rm(folderPath, { recursive: true }).catch(() => { });
      await makeSureFolderExists(folderPath);
      await extractZip(zipPath, { dir: folderPath });
      fs.promises.unlink(zipPath).catch(() => null);
      if (folderOrZip.name.startsWith("-")) continue;
      result.push(path.resolve(folderPath, "index.js"));
    }
  }

  return result;
}