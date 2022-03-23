require("./patchConsoleLog");

const chillout = require("chillout");
const fs = require("fs");
const extractZip = require("extract-zip");
const { makeSureFolderExists } = require("stuffs");
const path = require("path");

globalThis.Underline = {
  Plugin: require("../types/Plugin")
};

(async () => {
  let pluginFiles = await getPluginFilePaths();
  let pluginTypes = [];
  let TEventNames = [];
  let TEvents = [];
  let TInterfaces = [];
  let loadedNamespaces = [];
  await chillout.forEach(pluginFiles, async (pluginFile) => {
    let rltPath = path.relative(__dirname, pluginFile);
    console.info(`[BİLGİ] "${rltPath}" konumundaki plugin yükleniyor..`)
    /** @type {import("../types/Plugin")} */
    let plugin = require(pluginFile);
    console.info("Plugin:", plugin._type, plugin.namespace, plugin);
    // console.log(plugin)

    if (plugin._type != "plugin")
      return console.warn(`[UYARI] "${rltPath}" plugin dosyası boş. Atlanıyor..`);

    if (loadedNamespaces.find(x => x == plugin.namespace))
      return console.warn(`[UYARI] ${plugin.name} plugini zaten yüklenmiş. Atlanıyor..`);

    loadedNamespaces.push(plugin.namespace);

    let parsedPluginPath = path.parse(pluginFile);
    // console.log(parsedPluginPath)

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
    console.log(dtsPath);
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

    console.info(`[BİLGİ] "${plugin.name}" plugini tipi çıkartıldı.`);
  });

  await makeSureFolderExists(path.resolve(__dirname, "../generated"));
  let result = `export class Types {\n${pluginTypes.map(i => `  ${i};`).join("\n")}\n};\n${`export type TEventNames = ${TEventNames.join(" | ").trim() || '""'};`}\n${`export type TEvents = ${TEvents.join(" | ").trim() || "[]"};`}\n${TInterfaces.join("\n")}\n`.trim();
  console.info(result);
  await fs.promises.writeFile(path.resolve(__dirname, "../generated/pluginTypes.d.ts"), result);


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
  console.log(result)
  return result;
}