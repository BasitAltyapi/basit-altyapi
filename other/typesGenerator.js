require("./patchConsoleLog");

const chillout = require("chillout");
const fs = require("fs");
const extractZip = require("extract-zip");
const { makeSureFolderExists } = require("stuffs");
const path = require("path");
const readdirRecursive = require("recursive-readdir");
const config = require("../config");
const { Collection } = require("discord.js");

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
      // let implements = Object.entries(plugin.implements.properties);
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
        TInterfaces.push(`export interface ${plugin.namespace}_${eventName.replace(/ |-/, "")} { eventName: "${plugin.namespace}:${eventName}", onEvent: (${!args?.[0] ? "" : args.map((v, i) => v.includes(":") ? v : `arg${i}: ${v}`).join(", ")}) => void }`);
        TEvents.push(`${plugin.namespace}_${eventName.replace(/ |-/, "")}`);

      }
    }

    if (plugin.locale) {
      locales.forEach((locale) => {
        if (!locale.inConstructor) locale.inConstructor = { locale: locale.locale, data: locale._data, commands: locale.commands };
        if (!locale.inConstructor.data[plugin.namespace] 
          // || JSON.stringify(locale.inConstructor.data[plugin.namespace])?.match(/("([^"]*[^\\]?)"|`([^`]*[^\\]?)`|'([^']*[^\\]?)')\:/g)?.join("|") != JSON.stringify(plugin.locale).match(/("([^"]*[^\\]?)"|`([^`]*[^\\]?)`|'([^']*[^\\]?)')\:/g)?.join("|")
          ) {
          locale.inConstructor.data[plugin.namespace] = plugin.locale;
          locale.overwrite = true;
        }
      })
    }

  });

  locales.forEach(locale => {
    if (locale.overwrite) {
      locale.inConstructor = JSON.stringify(locale.inConstructor, null, 2).replace(/("([^"]*[^\\]?)"|`([^`]*[^\\]?)`|'([^']*[^\\]?)')\:/g, "$2$4$3:");
      fs.writeFileSync(locale.path, `module.exports = new Underline.Locale(${locale.inConstructor});`);
    }
  });

  let defaultLocale = locales.get(Underline.config.defaultLanguage);

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

    if (uInter?._type != "interaction" && uInter?._type != "ComponentInteraction") return;

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
  let pluginTypesResult = `export class Types {\n${pluginTypes.map(i => `  ${i};`).join("\n")}\n};\n${`export type TEventNames = ${TEventNames.join(" | ").trim() || '""'};`}\n${`export type TEvents = ${TEvents.join(" | ").trim() || "[]"};`}\n${TInterfaces.join("\n")}\n`.trim();
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