const config = require("./config");
const {plsParseArgs} = require("plsargs");
const Discord = require("discord.js");
const chillout = require("chillout");
const path = require("path");
const readdirRecursive = require("recursive-readdir");
const { makeSureFolderExists } = require("stuffs");
const Command = require("./types/Command");
const client = new Discord.Client(config.clientOptions);

global.commands = new Discord.Collection();
global.events = new Discord.Collection();
global.config = config;
global.client = client;

console.info("[BİLGİ] Basit Altyapı - by Kıraç Armağan Önal");
(async () => {
  let commandsPath = path.resolve("./commands");
  await makeSureFolderExists(commandsPath);
  let eventsPath = path.resolve("./events");
  await makeSureFolderExists(eventsPath);

  config.onBeforeLoad(client);

  let loadStart = Date.now();
  let commandFiles = await readdirRecursive(commandsPath);

  await chillout.forEach(commandFiles, (commandFile) => {
    let start = Date.now();
    console.info(`[BİLGİ] "${commandFile}" komut yükleniyor..`)
    /** @type {import("./types/Command")} */
    let command = require(commandFile);

    if (typeof command.name != "string") command.name = path.basename(commandFile).slice(0, -3).replace(/ /g, "");
    if (!command.aliases.includes(command.name)) command.aliases.unshift(command.name);

    if (global.commands.has(command.name)) {
      console.warn(`[UYARI] "${command.name}" adlı bir komut daha önceden zaten yüklenmiş. Atlanıyor.`)
      return;
    }

    if (typeof command.onCommand != "function") {
      console.error(`[HATA] "${command.name}" adlı komut geçerli bir onCommand fonksiyonuna sahip değil! Atlanıyor.`);
      return;
    };

    if (!command.guildOnly && (command.perms.bot.length != 0 || command.perms.user.length != 0)) {
      console.warn(`[UYARI] "${command.name}" adlı komut sunuculara özel olmamasına rağmen özel perm kullanıyor.`);
    }

    global.commands.set(command.name, command);
    command.onLoad(client);
    console.info(`[BİLGİ] "${command.name}" adlı komut yüklendi. (${Date.now() - start}ms sürdü.)`);
  });

  if (global.commands.size) {
    console.info(`[BİLGİ] ${global.commands.size} komut yüklendi.`);
  } else {
    console.warn(`[UYARI] Hiçbir komut yüklenmedi, herşey yolunda mı?`);
  }

  let eventFiles = await readdirRecursive(eventsPath);
  await chillout.forEach(eventFiles, async (eventFile) => {
    let start = Date.now();
    console.info(`[BİLGİ] "${eventFile}" event yükleniyor..`);

    /** @type {import("./types/Event")} */
    let event = require(eventFile);

    if (typeof event.name != "string") event.name = path.basename(eventFile).slice(0, -3).replace(/ /g, "");

    if (global.events.has(event.name)) {
      console.warn(`[UYARI] "${event.name}" adlı bir event daha önceden zaten yüklenmiş. Atlanıyor.`);
      return;
    }

    if (typeof event.onEvent != "function") {
      console.error(`[HATA] "${event.name}" adlı event geçerli bir onEvent fonksiyonuna sahip değil! Atlanıyor.`);
      return;
    };

    global.events.set(event.name, event);
    event.onLoad(client);
    console.info(`[BİLGİ] "${event.name}" adlı event yüklendi. (${Date.now() - start}ms sürdü.)`);
  })

  if (global.events.size) {
    console.info(`[BİLGİ] ${global.events.size} event yüklendi.`);
  } else {
    console.warn(`[UYARI] Hiçbir event yüklenmedi, herşey yolunda mı?`);
  }

  client.on("message", async (message) => {
    if (message.author.id == client.user.id) return;

    let usedPrefix = "";
    let usedAlias = "";
    let content = message.content;
    
    await chillout.forEach(config.prefixes, (p) => {
      if (content.slice(0, p.length).toLowerCase() == p.toLowerCase()) {
        usedPrefix = p;
        usedAlias = content.slice(p.length).trim().split(" ", 2)[0];
        return chillout.StopIteration;
      }
    });

    if (!usedPrefix || !usedAlias) return;
    let lowerUsedAlias = usedAlias.toLowerCase();
    let args = content.trim().split(" ");
    let plsargs = plsParseArgs(args);

    chillout.forEach(
      global.commands.array(),
      /**
       * @param {Command} command
       */
      (command) => {
        if (!command.aliases.some(i => i.toLowerCase() == lowerUsedAlias)) return;
        
        if (command.developerOnly && !config.developers.has(message.author.id)) {
          config.messages.developerOnly(message, command);
          return chillout.StopIteration;
        }

        if (config.blockedUsers.has(message.author.id)) {
          config.messages.blocked(message, command);
          return chillout.StopIteration;
        }

        if (command.guildOnly && message.channel.type == "dm") {
          config.messages.guildOnly(message, command);
          return chillout.StopIteration;
        }

        if (command.disabled) {
          config.messages.disabled(message, command);
          return chillout.StopIteration;
        }

        if (command.guildOnly && command.perms.bot.length != 0 && !command.perms.bot.every(perm => message.guild.me.permissions.has(perm))) {
          config.messages.botPermsRequired(message, command, command.perms.bot);
          return chillout.StopIteration;
        }

        if (command.guildOnly && command.perms.user.length != 0 && !command.perms.user.every(perm => message.member.permissions.has(perm))) {
          config.messages.userPermsRequired(message, command, command.perms.user);
          return chillout.StopIteration;
        }

        let userCooldown = command.coolDowns.get(message.author.id) || 0;
        if (Date.now() < userCooldown) {
          config.messages.timeout(message, command, userCooldown - Date.now());
          return chillout.StopIteration;
        }

        command.onCommand(message, {
          args, plsargs, usedPrefix, usedAlias,
          setCooldown(duration = 0) {
            if (typeof duration == "number" && duration > 0) {
              return command.coolDowns.set(message.author.id, Date.now() + duration);
            } else {
              return command.coolDowns.delete(message.author.id);
            }
          }
        })

        return chillout.StopIteration;
      }
    );
  })

  {
    /** @type {Map<string, (import("./types/Event"))[]>} */
    let eventsMapped = global.events.array().reduce((all, cur) => {
      if (!all.has(cur.eventName)) all.set(cur.eventName, []);
      all.get(cur.eventName).push(cur);
      return all;
    }, new Map());

    await chillout.forEach(
      Array.from(eventsMapped.entries()),
      /**
       * @param {[string, (import("./types/Event"))[]>]} param0
       */
      ([eventName, events]) => {
        console.info(`[BİLGİ] Event "${eventName}" için ${events.length} dinleyici yüklendi!`);
        client.on(eventName, (...args) => {
          chillout.forEach(events, (event) => {
            if (!event.disabled) {
              event.onEvent(...args);
            }
          });
        });
      }
    )
  }

  console.info(`[BİLGİ] Herşey ${Date.now() - loadStart}ms içerisinde yüklendi!`);

  commandFiles = 0;
  eventFiles = 0;
  loadStart = 0;

  config.onAfterLoad(client);

  await client.login(config.clientToken);
  console.info("[BİLGİ] Discord'a bağlanıldı!", client.user.tag);
  config.onReady(client);
})();



