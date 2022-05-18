require("./other/patchConsoleLog");
console.info(`[BİLGİ] Basit Altyapı v${require("./package.json").version} - by Kıraç Armağan Önal`);
const config = require("./config");
const utils = require("./other/utils");
globalThis.Underline = config.globalObjects;
const Discord = require("discord.js");
const chillout = require("chillout");
const path = require("path");
const fs = require("fs");
const readdirRecursive = require("recursive-readdir");
const { makeSureFolderExists } = require("stuffs");
const client = new Discord.Client(config.clientOptions);
const interactions = new Discord.Collection();
const events = new Discord.Collection();
const locales = new Discord.Collection();
const { quickMap, quickForEach } = require("async-and-quick");
let interactionFiles;
let eventFiles;
let localeFiles;
let pluginFiles;
let onFunctions = {
  onInteractionBeforeChecks: [config.onInteractionBeforeChecks],
  onInteraction: [config.onInteraction],
  onAfterInteraction: [config.onAfterInteraction],
  onEvent: [config.onEvent],
  onAfterEvent: [config.onAfterEvent],
  onReady: [config.onReady],
};
globalThis.Underline = {
  ...config.globalObjects,
  config,
  other: config.other,
  client,
  interactions,
  events,
  locales,
  utils,
  plugins: {},
  _references: new Discord.Collection(),
  Interaction: require('./types/Interaction'),
  Event: require('./types/Event'),
  ChatInput: require("./types/ChatInput"),
  MessageAction: require("./types/MessageAction"),
  UserAction: require("./types/UserAction"),
  SelectMenu: require("./types/SelectMenu"),
  Button: require("./types/Button"),
  Modal: require("./types/Modal"),
  Locale: require("./types/Locale"),
  Plugin: require("./types/Plugin"),
}

const extractZip = require("extract-zip");

async function getPluginFilePaths() {
  let pluginsPath = path.resolve("./plugins");
  await makeSureFolderExists(pluginsPath);
  let folderOrZips = await fs.promises.readdir(pluginsPath, { withFileTypes: true });
  let result = [];
  for (let i = 0; i < folderOrZips.length; i++) {
    const folderOrZip = folderOrZips[i];
    if (folderOrZip.isDirectory()) {
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

async function getEventFilePaths() {
  let eventsPath = path.resolve("./events");
  let pluginsPath = path.resolve("./plugins");
  await makeSureFolderExists(eventsPath);
  await makeSureFolderExists(pluginsPath);
  let VEventFiles = await readdirRecursive(eventsPath);
  let VPluginFiles = await readdirRecursive(eventsPath);
  VEventFiles = VEventFiles.filter(i => {
    let state = path.basename(i).startsWith("-");
    return !state;
  });
  VPluginFiles = VPluginFiles.filter(i => {
    if (!(i.endsWith("event.js") || i.endsWith("event.up.js"))) return false;
    let state = path.basename(i).startsWith("-");
    return !state;
  });
  return [...VEventFiles, ...VPluginFiles];
}

async function getInteractionFilePaths() {
  let interactionsPath = path.resolve("./interactions");
  let pluginsPath = path.resolve("./plugins");
  await makeSureFolderExists(interactionsPath);
  await makeSureFolderExists(pluginsPath);
  let VInteractionFiles = await readdirRecursive(interactionsPath);
  let VPluginFiles = await readdirRecursive(eventsPath);
  VInteractionFiles = VInteractionFiles.filter(i => {
    let state = path.basename(i).startsWith("-");
    return !state;
  });
  VPluginFiles = VPluginFiles.filter(i => {
    if (!(i.endsWith("inter.js") || i.endsWith("inter.up.js") || i.endsWith("interaction.js") || i.endsWith("interaction.up.js"))) return false;
    let state = path.basename(i).startsWith("-");
    return !state;
  });
  return [...VInteractionFiles, ...VPluginFiles];
}

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

/** @type {{name:string,listener:()=>any,base:any}[]} */
let eventListeners = [];

async function load() {

  onFunctions = {
    onInteractionBeforeChecks: [config.onInteractionBeforeChecks],
    onInteraction: [config.onInteraction],
    onAfterInteraction: [config.onAfterInteraction],
    onEvent: [config.onEvent],
    onAfterEvent: [config.onAfterEvent],
    onReady: [config.onReady],
  };

  let loadStart = Date.now();
  console.debug(`[HATA AYIKLAMA] Yüklemeye başlandı!`);

  localeFiles = await getLocaleFilePaths();
  await chillout.forEach(localeFiles, (localeFile) => {
    let start = Date.now();
    let rltPath = path.relative(__dirname, localeFile);
    console.info(`[BİLGİ] "${rltPath}" konumundaki dil yükleniyor..`)
    /** @type {import("./types/Locale")} */
    let locale = require(localeFile);

    if (locale._type != "locale")
      return console.warn(`[UYARI] "${rltPath}" dil dosyası boş. Atlanıyor..`);

    if (locales.has(locale.locale))
      return console.warn(`[UYARI] ${locale.locale} dili zaten yüklenmiş. Atlanıyor..`);

    locales.set(locale.locale, locale);
    console.info(`[BİLGİ] "${locale.locale}" dili yüklendi. (${Date.now() - start}ms sürdü.)`);
  })

  pluginFiles = await getPluginFilePaths();
  let pluginCache = [];
  await chillout.forEach(pluginFiles, (pluginFile) => {
    let start = Date.now();
    let rltPath = path.relative(__dirname, pluginFile);
    console.info(`[BİLGİ] "${rltPath}" konumundaki plugin yükleniyor..`)
    /** @type {import("./types/Plugin")} */
    let plugin = require(pluginFile);
    let isReady = false;

    if (plugin._type != "plugin")
      return console.warn(`[UYARI] "${rltPath}" plugin dosyası boş. Atlanıyor..`);

    if (Underline.plugins[plugin.namespace])
      return console.warn(`[UYARI] ${plugin.name} plugini zaten yüklenmiş. Atlanıyor..`);

    pluginCache.push(plugin);
    console.info(`[BİLGİ] "${plugin.name}" plugini yüklenme sırasına alındı. (${Date.now() - start}ms sürdü.)`);

  })

  pluginCache = pluginCache.sort((plugin, dependency) => plugin?.requires?.plugins?.includes(dependency) ? 1 : 0);

  let pluginSort = utils.sortDependant(pluginCache.map(i => i.namespace), Object.fromEntries(pluginCache.map(i => [i.namespace, i?.requires?.plugins || []])))

  await chillout.forEach(pluginSort, async (pluginNamespace) => {
    let start = Date.now();

    const plugin = pluginCache.find(x => x.namespace === pluginNamespace);

    const pluginApi = {};
    let isReady = false;

    pluginApi.setPluginReady = async () => {
      if (isReady) throw new Error("Plugin is already ready!")
      isReady = true;
    }

    Underline.plugins[plugin.namespace] = {};

    pluginApi.define = (name, value) => {
      Underline.plugins[plugin.namespace][name] = value;
    }

    pluginApi.emit = (name, ...args) => {
      client.emit(`${plugin.namespace}:${name}`, ...args);
    }

    pluginApi.onInteractionBeforeChecks = onFunctions.onInteractionBeforeChecks.push;
    pluginApi.onInteraction = onFunctions.onInteraction.push;
    pluginApi.onAfterInteraction = onFunctions.onAfterInteraction.push;

    pluginApi.onEvent = onFunctions.onEvent.push;
    pluginApi.onAfterEvent = onFunctions.onAfterEvent.push;
    pluginApi.onBotReady = onFunctions.onReady.push;

    pluginApi.client = client;

    plugin.onLoad(pluginApi);
    console.info(`[BİLGİ] "${plugin.name}" pluginin yüklenmesi bekleniyor!`);
    await chillout.waitUntil(() => {
      if (isReady) return chillout.StopIteration;
    })
    console.info(`[BİLGİ] "${plugin.name}" plugini yüklendi! (${Date.now() - start}ms sürdü.)`);
  })


  for (let ind in onFunctions) onFunctions[ind] = onFunctions[ind].filter(x => typeof x === "function");

  interactionFiles = await getInteractionFilePaths();
  await chillout.forEach(interactionFiles, (interactionFile) => {
    let start = Date.now();
    let rltPath = path.relative(__dirname, interactionFile);
    console.info(`[BİLGİ] "${rltPath}" konumundaki interaksiyon yükleniyor..`)
    /** @type {import("./types/Interaction")} */
    let uInter = require(interactionFile);

    if (uInter?._type != "interaction" && uInter?._type != "ComponentInteraction") {
      if (Underline.config.debugLevel >= 1) console.warn(`[UYARI] "${rltPath}" interaksiyon dosyası boş. Atlanıyor..`);
      return;
    }

    if (!uInter.id) {
      if (Underline.config.debugLevel >= 1) console.warn(`[UYARI] "${rltPath}" interaksiyon dosyasının bir idsi bulunmuyor. Atlanıyor..`);
      return;
    }

    if (uInter.name.length > 3) {
      if (Underline.config.debugLevel >= 1) console.warn(`[UYARI] "${rltPath}" interaksiyon dosyasının isim listesi çok uzun. (>3) Atlanıyor..`);
      return;
    }

    if (!uInter.name?.length) {
      if (Underline.config.debugLevel >= 1) console.warn(`[UYARI] "${rltPath}" interaksiyon dosyasının bir ismi bulunmuyor. Atlanıyor..`);
      return;
    }

    if (Underline.interactions.has(uInter.id)) {
      if (Underline.config.debugLevel >= 1) console.warn(`[UYARI] "${uInter.id}" idli bir interaksiyon daha önceden zaten yüklenmiş. Atlanıyor.`)
      return;
    }

    if (typeof uInter.onInteraction != "function") {
      if (Underline.config.debugLevel >= 1) console.error(`[HATA] "${rltPath}" interaksiyon dosyası geçerli bir onInteraction fonksiyonuna sahip değil! Atlanıyor.`);
      return;
    };

    uInter.calculated = {
      developerOnly: false,
      guildOwnerOnly: false
    }

    if (uInter.developerOnly) {
      uInter.calculated.developerOnly = true;
      if (Underline.config.debugLevel >= 1) console.warn(`[UYARI] "${uInter.id}" idli interaksiyon'da developerOnly seçeneğini kullanmışsınız, bu seçenek ilerki sürümlerde kaldırılacaktır lütfen bunu yapmak yerine perms.user kısmına "Developer"'ı koyunuz.`)
    }

    {
      let devOnlyIndex = uInter.perms.user.findIndex(p => p == "Developer");
      if (devOnlyIndex > -1) {
        uInter.calculated.developerOnly = true;
        uInter.perms.user.splice(devOnlyIndex, 1);
      }

      let gOwnerOnlyIndex = uInter.perms.user.findIndex(p => p == "GuildOwner");
      if (gOwnerOnlyIndex > -1) {
        uInter.calculated.guildOwnerOnly = true;
        uInter.perms.user.splice(gOwnerOnlyIndex, 1);
      }
    }

    if (!uInter.guildOnly && (uInter.perms.bot.length != 0 || uInter.perms.user.length != 0)) {
      if (Underline.config.debugLevel >= 1) console.warn(`[UYARI] "${rltPath}" interaksiyon dosyası sunuculara özel olmamasına rağmen özel perm kullanıyor.`);
    }

    if (!uInter.guildOnly && uInter.calculated.guildOwnerOnly) {
      if (Underline.config.debugLevel >= 1) console.error(`[HATA] "${rltPath}" interaksiyon dosyası sunuculara özel olmamasına rağmen sunucu sahibine özel! Atlanıyor.`);
      return;
    }

    Underline.interactions.set(uInter.id, uInter);
    uInter.onLoad(client);
    console.info(`[BİLGİ] "${uInter.actionType == "ChatInput" ? `/${uInter.name.join(" ")}` : `${uInter.name[0]}`}" (${uInter.id}) adlı interaksiyon yüklendi. (${Date.now() - start}ms sürdü.)`);
  });

  if (Underline.interactions.size) {
    console.info(`[BİLGİ] ${Underline.interactions.size} interaksiyon yüklendi.`);
  } else {
    if (Underline.config.debugLevel >= 1) console.warn(`[UYARI] Hiçbir interaksiyon yüklenmedi, herşey yolunda mı?`);
  }

  eventFiles = await getEventFilePaths();

  await chillout.forEach(eventFiles, async (eventFile) => {
    let start = Date.now();
    let rltPath = path.relative(__dirname, eventFile);
    console.info(`[BİLGİ] "${rltPath}" event yükleniyor..`);

    /** @type {import("./types/Event")} */
    let event = require(eventFile);

    if (event?._type != "event") {
      if (Underline.config.debugLevel >= 1) console.warn(`[UYARI] "${rltPath}" event dosyası boş. Atlanıyor..`);
      return;
    }

    if (typeof event.id != "string") event.id = path.basename(eventFile).slice(0, -3).replace(/ /g, "");

    if (Underline.events.has(event.id)) {
      if (Underline.config.debugLevel >= 1) console.warn(`[UYARI] "${event.id}" adlı bir event daha önceden zaten yüklenmiş. Atlanıyor.`);
      return;
    }

    if (typeof event.onEvent != "function") {
      if (Underline.config.debugLevel >= 1) console.error(`[HATA] "${rltPath}" olay dosyası geçerli bir onEvent fonksiyonuna sahip değil! Atlanıyor.`);
      return;
    };

    Underline.events.set(event.id, event);
    event.onLoad(client);
    console.info(`[BİLGİ] ("${rltPath}") "${event.id}" adlı event yüklendi. (${Date.now() - start}ms sürdü.)`);
  })

  // Önce ismi daha uzun olanlar test edilsin diye.
  Underline.interactions.sort((a, b) => b.name.length - a.name.length);

  if (Underline.events.size) {
    console.info(`[BİLGİ] ${Underline.events.size} event yüklendi.`);
  } else {
    if (Underline.config.debugLevel >= 1) console.warn(`[UYARI] Hiçbir olay yüklenmedi, herşey yolunda mı?`);
  }

  {
    /** @type {Map<string, (import("./types/Event"))[]>} */
    let eventsMapped = Underline.events.reduce((all, cur) => {
      if (!all.has(cur.eventName)) all.set(cur.eventName, []);
      all.get(cur.eventName).push(cur);
      return all;
    }, new Map());

    await chillout.forEach(
      [...eventsMapped.entries()],
      /**
       * @param {[string, (import("./types/Event"))[]>]} param0
       */
      ([eventName, events]) => {
        console.info(`[BİLGİ] Event "${eventName}" için ${events.length} dinleyici yüklendi!`);

        let listener = (...args) => {

          setTimeout(async () => {

            let other = {};

            let before = (await quickMap(onFunctions.onEvent, async (func) => { return await func(eventName, args, other); })).findIndex(v => v === false);
            if (before != -1) return;
            args.push(other);
            chillout.forEach(events,
              /** @param {import("./types/Event")} event */
              (event) => {
                if (!event.disabled) {
                  try {
                    event.onEvent(...args);
                    quickForEach(onFunctions.onAfterEvent, async (func) => { func(...args); });
                  } catch (err) {
                    if (Underline.config.debugLevel >= 1) {
                      console.error(`[HATA] "${event.id}" idli ve "${eventName}" isimli olayda bir hata oluştu!`);
                      if (err.message) console.error(`[HATA] ${err.message}`);
                      if (err.stack) {
                        `${err.stack}`.split("\n").forEach((line) => {
                          console.error(`[HATA] ${line}`);
                        });
                      }
                    }
                  }
                }
              });

          }, 0)
        }
        client.on(eventName, listener);
        eventListeners.push({ name: eventName, base: client, listener });
      }
    )
  }

  console.debug(`[HATA AYIKLAMA] Herşey ${Date.now() - loadStart}ms içerisinde yüklendi!`);

  loadStart = 0;
}

async function unloadModule(modulePath) {
  let nodeModule = require.cache[modulePath];
  if (nodeModule) {
    if (nodeModule.children.length) await chillout.forEach(nodeModule.children, async (child) => {
      if (child.filename) unloadModule(child.filename);
    });
  }
  delete require.cache[modulePath];
}

async function unload() {
  console.debug(`[HATA AYIKLAMA] Önbellek temizle işlemi başladı.`);
  let unloadStart = Date.now();

  console.info(`[BILGI] Plugin listesi temizleniyor..`);
  Underline.plugins = {};

  console.info(`[BILGI] İnteraksiyon listesi temizleniyor..`);
  Underline.interactions.clear();

  console.info(`[BILGI] Olay listesi temizleniyor..`);
  Underline.events.clear();

  console.info(`[BILGI] Olay dinleyicileri temizleniyor..`);
  await chillout.forEach(eventListeners, (el) => {
    el.base.off(el.name, el.listener);
  })
  eventListeners.length = 0;

  console.info(`[BILGI] Dil listesi temizleniyor..`);
  Underline.locales.clear();

  let pathsToUnload = [...interactionFiles, ...eventFiles, ...localeFiles, ...pluginFiles];

  await chillout.forEach(pathsToUnload, async (pathToUnload) => {
    console.info(`[BILGI] Modül "${path.relative(__dirname, pathToUnload)}" önbellekten kaldırılıyor!`);
    await unloadModule(pathToUnload);
  });

  console.debug(`[HATA AYIKLAMA] Önbellek temizleme ${Date.now() - unloadStart}ms içerisinde tamamlandı!`);

  unloadStart = 0;
  pathsToUnload = 0;

}

async function reload() {
  await unload();
  await load();
}

client.on("interactionCreate", async (interaction) => {
  let subCommandName = "";
  try { subCommandName = interaction.options.getSubcommand(); } catch { };
  let subCommandGroupName = "";
  try { subCommandGroupName = interaction.options.getSubcommandGroup(); } catch { };

  let data = [];

  if (interaction.isButton() || interaction.isSelectMenu() || interaction.isModalSubmit()) {
    data = interaction.customId.split("—");
    interaction.customId = data.shift();
    data = data.map(key => {
      if (key.startsWith("π") && !isNaN(key.slice(1))) return Number(key.slice(1));
      if (key.startsWith("¤")) return Underline._references.get(key.slice(1)) || null;
      return key;
    })
  }

  let uInter = Underline.interactions.find(uInter => {
    switch (uInter.name.length) {
      case 1: return (uInter.name[0] == interaction.commandName) || ((uInter.id == interaction.customId) && (
        (uInter.actionType == "ChatInput" && (interaction.isCommand() || interaction.isAutocomplete())) ||
        (uInter.actionType == "SelectMenu" && interaction.isSelectMenu()) ||
        (uInter.actionType == "Button" && interaction.isButton()) ||
        (uInter.actionType == "Modal" && interaction.isModalSubmit()) ||
        ((uInter.actionType == "User" || uInter.actionType == "Message") && interaction.isContextMenuCommand())
        ));
      case 2: return uInter.name[0] == interaction.commandName && uInter.name[1] == subCommandName && (interaction.isCommand() || interaction.isAutocomplete());
      case 3: return uInter.name[0] == interaction.commandName && uInter.name[1] == subCommandGroupName && uInter.name[2] == subCommandName && (interaction.isCommand() || interaction.isAutocomplete());
    }
  });

  if (!uInter) return;

  let other = {
    data
  };

  if (interaction.isAutocomplete()) {
    if (uInter.disabled) {
      let r = await config.userErrors.disabled(interaction, uInter, other);
      interaction.respond(r).catch(Underline.config.debugLevel >= 2 ? console.error : () => { })
      return;
    }
    if (config.blockedUsers.has(interaction.user.id)) {
      let r = await config.userErrors.blocked(interaction, uInter, other);
      interaction.respond(r).catch(Underline.config.debugLevel >= 2 ? console.error : () => { })
      return;
    }
    if (uInter.guildOnly && !interaction.guildId) {
      let r = await config.userErrors.guildOnly(interaction, uInter, other);
      interaction.respond(r).catch(Underline.config.debugLevel >= 2 ? console.error : () => { })
      return;
    }
    if (uInter.calculated.developerOnly && !config.developers.has(interaction.user.id)) {
      let r = await config.userErrors.developerOnly(interaction, uInter, other);
      interaction.respond(r).catch(Underline.config.debugLevel >= 2 ? console.error : () => { })
      return;
    }
    if (uInter.calculated.guildOwnerOnly && !config.developers.has(interaction.user.id) && interaction.guild.ownerId != interaction.user.id) {
      let r = await config.userErrors.guildOwnerOnly(interaction, uInter, other);
      interaction.respond(r).catch(Underline.config.debugLevel >= 2 ? console.error : () => { })
      return;
    }
    if (uInter.guildOnly && (!config.developers.has(interaction.user.id)) && uInter.perms.user.length != 0 && !uInter.perms.user.every(perm => interaction.member.permissions.has(perm))) {
      let r = await config.userErrors.userPermsRequired(interaction, uInter, uInter.perms.user, other);
      interaction.respond(r).catch(Underline.config.debugLevel >= 2 ? console.error : () => { })
      return;
    }
    /** @type {Discord.ApplicationCommandOptionChoice} */
    let focussed = null;
    try { focussed = interaction.options.getFocused(true) } catch { };
    let option = uInter.options.find(i => i.autocomplete && i.name == focussed?.name);
    if (option) {
      try {
        let completeResponse = await option.onComplete(interaction, focussed.value);
        interaction.respond(completeResponse).catch(Underline.config.debugLevel >= 2 ? console.error : () => { });
      } catch (err) {
        if (Underline.config.debugLevel >= 1) {
          console.error(`[HATA] "${uInter.actionType == "ChatInput" ? `/${uInter.name.join(" ")}` : `${uInter.name[0]}`}" adlı interaksiyon için otomatik tamamlama çalıştırılırken bir hata ile karşılaşıldı!`)
          if (err.message) console.error(`[HATA] ${err.message}`);
          if (err.stack) {
            `${err.stack}`.split("\n").forEach((line) => {
              console.error(`[HATA] ${line}`);
            });
          }
        }
      }
    }
    return;
  }

  {
    let locale_id = (interaction.user.locale || interaction.locale)?.split("-")[0];
    other.locale = (Underline.locales.get(locale_id) || Underline.locales.get(Underline.config.defaultLanguage)).data;
  }

  {
    let shouldRun1 = (await quickMap(onFunctions.onInteractionBeforeChecks, async (func) => { return await func(uInter, interaction, other); })).findIndex(v => v === false);
    if (shouldRun1 != -1) return;
  }

  if (uInter.disabled) {
    if (uInter.nullError) return interaction.update ? (await interaction.update().catch(Underline.config.debugLevel >= 2 ? console.error : () => { })) : null;
    config.userErrors.disabled(interaction, uInter, other);
    return;
  }

  if (config.blockedUsers.has(interaction.user.id)) {
    if (uInter.nullError) return interaction.update ? (await interaction.update().catch(Underline.config.debugLevel >= 2 ? console.error : () => { })) : null;
    config.userErrors.blocked(interaction, uInter, other);
    return;
  }

  if (uInter.guildOnly && !interaction.guildId) {
    if (uInter.nullError) return interaction.update ? (await interaction.update().catch(Underline.config.debugLevel >= 2 ? console.error : () => { })) : null;
    config.userErrors.guildOnly(interaction, uInter, other);
    return;
  }

  if (uInter.calculated.developerOnly && !config.developers.has(interaction.user.id)) {
    if (uInter.nullError) return interaction.update ? (await interaction.update().catch(Underline.config.debugLevel >= 2 ? console.error : () => { })) : null;
    config.userErrors.developerOnly(interaction, uInter, other);
    return;
  }

  if (uInter.calculated.guildOwnerOnly && !config.developers.has(interaction.user.id) && interaction.guild.ownerId != interaction.user.id) {
    if (uInter.nullError) return interaction.update ? (await interaction.update().catch(Underline.config.debugLevel >= 2 ? console.error : () => { })) : null;
    config.userErrors.guildOwnerOnly(interaction, uInter, other);
    return;
  }

  if (uInter.guildOnly && uInter.perms.bot.length != 0 && !uInter.perms.bot.every(perm => interaction.guild.me.permissions.has(perm))) {
    if (uInter.nullError) return interaction.update ? (await interaction.update().catch(Underline.config.debugLevel >= 2 ? console.error : () => { })) : null;
    config.userErrors.botPermsRequired(interaction, uInter, uInter.perms.bot, other);
    return;
  }

  if (uInter.guildOnly && (!config.developers.has(interaction.user.id)) && uInter.perms.user.length != 0 && !uInter.perms.user.every(perm => interaction.member.permissions.has(perm))) {
    if (uInter.nullError) return interaction.update ? (await interaction.update().catch(Underline.config.debugLevel >= 2 ? console.error : () => { })) : null;
    config.userErrors.userPermsRequired(interaction, uInter, uInter.perms.user, other);
    return;
  }

  if (uInter.autoDefer && uInter.autoDefer !== "off") {
    const newDefer = () => {
      if (Underline.config.debugLevel >= 1) console.warn(`[UYARI] "${uInter.actionType == "ChatInput" ? `/${uInter.name.join(" ")}` : `${uInter.name[0]}`}" adlı interaksiyon için "deferReply" umursanmadı, interaksiyon zaten otomatik olarak bekleme moduna alınmış.`);
    };
    if (
      interaction.isCommand() || interaction.isApplicationCommand() || interaction.isContextMenuCommand()
    ) {
      await interaction.deferReply(uInter.autoDefer == "ephemeral" ? { ephemeral: true } : null).catch(Underline.config.debugLevel >= 2 ? console.error : () => { });
      interaction.deferReply = newDefer;
      interaction.reply = interaction.editReply;
      interaction.update = interaction.editReply;
    } else if (
      interaction.isButton() || interaction.isSelectMenu() || interaction.isModalSubmit()
    ) {
      if (uInter.autoDefer == "update") await interaction.deferUpdate().catch(Underline.config.debugLevel >= 2 ? console.error : () => { });
      else await interaction.deferReply(uInter.autoDefer == "ephemeral" ? { ephemeral: true } : null).catch(Underline.config.debugLevel >= 2 ? console.error : () => { });
      interaction.deferReply = newDefer;
      interaction.reply = interaction.editReply;
      interaction.update = interaction.editReply;
    }
  }

  if (typeof uInter.coolDown == "number") uInter.coolDown = [{
    type: "user",
    amount: uInter.coolDown,
  }];

  if (typeof uInter.coolDown == "object" && !Array.isArray(uInter.coolDown)) uInter.coolDown = [uInter.coolDown];

  let converter = {
    "user": interaction.user.id,
    "member": interaction.user.id + "" + interaction.guild?.id,
    "channel": interaction.channelId || interaction.user.id + " _c",
    "guild": interaction.guildId || interaction.user.id + "_g",
    "message": interaction.message?.id || (interaction.channelId + "_m") || (interaction.user.id + "_m"),
    "any": "any"
  }

  let now = Date.now();

  for (let k in converter) {
    let keyCooldown = uInter.coolDowns.get(k);
    if (now < keyCooldown) {
      config.userErrors.coolDown(interaction, uInter, keyCooldown - now, k, other);
      return;
    }
  }

  function setCoolDown(duration = 0, type = "user") {
    let ckey = converter[type] || interaction.user.id;
    if (typeof duration == "number" && duration > 0) {
      return uInter.coolDowns.set(ckey, Date.now() + duration);
    } else {
      return uInter.coolDowns.delete(ckey);
    }
  }

  other.setCoolDown = setCoolDown;
  for (let index = 0; index < uInter.coolDown.length; index++) {

    let cld = uInter.coolDown[index]
    if (cld && !cld.amount) cld.amount = 0;

    if (cld?.amount > 0) {
      setCoolDown(cld?.amount, cld?.type);
    }

  }

  (async () => {

    {
      let shouldRun2 = (await quickMap(onFunctions.onInteraction, async (func) => { try { return await func(uInter, interaction, other); } catch (e) { onfig.debugLevel > 2 ? console.error(e) : null; } })).findIndex(v => v === false);
      if (shouldRun2 != -1) return;
    }

    try {

      await uInter.onInteraction(interaction, other);
      quickForEach(onFunctions.onAfterInteraction, async (func) => { try { func(uInter, interaction, other)?.catch(config.debugLevel > 2 ? console.error : () => null); } catch (err) { (config.debugLevel > 2 ? console.error : () => null)(err) } })

    } catch (err) {
      if (Underline.config.debugLevel >= 1) {
        console.error(`[HATA] "${uInter.actionType == "ChatInput" ? `/${uInter.name.join(" ")}` : `${uInter.name[0]}`}" adlı interaksiyon çalıştırılırken bir hata ile karşılaşıldı!`)
        if (err.message) console.error(`[HATA] ${err.message}`);
        if (err.stack) {
          `${err.stack}`.split("\n").forEach((line) => {
            console.error(`[HATA] ${line}`);
          });
        }
      }
    }
  })();

  return;
});


(async () => {
  await config.onBeforeLoad(client);
  await load();
  await config.onAfterLoad(client);

  await client.login(config.clientToken);

  config.onReady(client);
  quickForEach(onFunctions.onReady, async (func) => {
    try {
      func?.()?.catch?.(() => {

      });
    } catch (err) {

    }

  })
})();

Underline.reload = reload;
