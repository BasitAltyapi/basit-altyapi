require("./other/patchConsoleLog");
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

  commandFiles = commandFiles.filter(i => {
    let state = path.basename(i).startsWith("-");
    if (state) console.warn(`[UYARI] "${i}" dosyası tire ile başladığı için liste dışı bırakıldı.`);
    return !state;
  });

  await chillout.forEach(commandFiles, (commandFile) => {
    let start = Date.now();
    console.info(`[BİLGİ] "${commandFile}" komut yükleniyor..`)
    /** @type {import("./types/Command")} */
    let command = require(commandFile);

    if (command?._type != "command") {
      console.warn(`[UYARI] "${commandFile}" komut dosyası boş. Atlanıyor..`);
      return;
    }

    if (!command.type) {
      console.warn(`[UYARI] "${commandFile}" komut dosyasın için bir type belirtilmemiş. Atlanıyor.`);
      return;
    }

    if (!command.id) {
      console.warn(`[UYARI] "${commandFile}" komut dosyasının bir idsi bulunmuyor. Atlanıyor..`);
      return;
    }

    if (typeof command.name != "string") {
      console.warn(`[UYARI] "${commandFile}" komut dosyasının bir ismi bulunmuyor. Atlanıyor..`);
      return;
    }
    command.name = command.name.replace(/ /g, "").toLowerCase();

    if (typeof command.type == "SUB_COMMAND" && !command.subName) {
      console.warn(`[UYARI] "${commandFile}" komut dosyasının tipi "SUB_COMMAND" ancak bir subName bulundurmuyor. Atlanıyor..`);
      return;
    }


    if (global.commands.has(command.id)) {
      console.warn(`[UYARI] "${command.id}" idli bir komut daha önceden zaten yüklenmiş. Atlanıyor.`)
      return;
    }

    if (typeof command.onCommand != "function") {
      console.error(`[HATA] "${command.name}" adlı komut geçerli bir onCommand fonksiyonuna sahip değil! Atlanıyor.`);
      return;
    };

    if (!command.guildOnly && (command.perms.bot.length != 0 || command.perms.user.length != 0)) {
      console.warn(`[UYARI] "${command.name}" adlı komut sunuculara özel olmamasına rağmen özel perm kullanıyor.`);
    }


    global.commands.set(command.id, command);
    command.onLoad(client);
    console.info(`[BİLGİ] "${command.name}${command.subName ? ` ${command.subName}` : ""}" (${command.id}) adlı komut yüklendi. (${Date.now() - start}ms sürdü.)`);
  });

  if (global.commands.size) {
    console.info(`[BİLGİ] ${global.commands.size} komut yüklendi.`);
  } else {
    console.warn(`[UYARI] Hiçbir komut yüklenmedi, herşey yolunda mı?`);
  }

  let eventFiles = await readdirRecursive(eventsPath);

  eventFiles = eventFiles.filter(i => {
    let state = path.basename(i).startsWith("-");
    if (state) console.warn(`[UYARI] "${i}" dosyası tire ile başladığı için liste dışı bırakıldı.`);
    return !state;
  });

  await chillout.forEach(eventFiles, async (eventFile) => {
    let start = Date.now();
    console.info(`[BİLGİ] "${eventFile}" event yükleniyor..`);

    /** @type {import("./types/Event")} */
    let event = require(eventFile);

    if (event?._type != "event") {
      console.warn(`[UYARI] "${eventFile}" event dosyası boş. Atlanıyor..`);
      return;
    }

    if (typeof event.id != "string") event.id = path.basename(eventFile).slice(0, -3).replace(/ /g, "");

    if (global.events.has(event.id)) {
      console.warn(`[UYARI] "${event.id}" adlı bir event daha önceden zaten yüklenmiş. Atlanıyor.`);
      return;
    }

    if (typeof event.onEvent != "function") {
      console.error(`[HATA] "${event.id}" adlı event geçerli bir onEvent fonksiyonuna sahip değil! Atlanıyor.`);
      return;
    };

    global.events.set(event.id, event);
    event.onLoad(client);
    console.info(`[BİLGİ] "${event.id}" adlı event yüklendi. (${Date.now() - start}ms sürdü.)`);
  })

  if (global.events.size) {
    console.info(`[BİLGİ] ${global.events.size} event yüklendi.`);
  } else {
    console.warn(`[UYARI] Hiçbir olay yüklenmedi, herşey yolunda mı?`);
  }

  client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) return;
    
    let command = global.commands.find(cmd => {
      if (cmd.type == "SUB_COMMAND") {
        return cmd.name == interaction.commandName && cmd.subName == interaction.options.getSubcommand();
      } else if (cmd.type == "COMMAND") {
        return cmd.name == interaction.commandName;
      }
    });

    if (!command) return;

    if (config.autoDefer) interaction.defer();

    if (command.disabled) {
      config.userErrors.disabled(interaction, command);
      return;
    }

    let shouldRun1 = await config.onCommandBeforeChecks(command, interaction);

    if (!shouldRun1) return;

    if (command.developerOnly && !config.developers.has(interaction.user.id)) {
      config.userErrors.developerOnly(interaction, command);
      return;
    }

    if (config.blockedUsers.has(interaction.user.id)) {
      config.userErrors.blocked(interaction, command);
      return;
    }

    if (command.guildOnly && interaction.channel.type == "dm") {
      config.userErrors.guildOnly(interaction, command);
      return;
    }


    let other = {};

    let userCooldown = command.coolDowns.get(interaction.user.id) || 0;
    if (Date.now() < userCooldown) {
      config.userErrors.coolDown(interaction, command, userCooldown - Date.now());
      return;
    }

    function setCoolDown(duration = 0) {
      if (typeof duration == "number" && duration > 0) {
        return command.coolDowns.set(interaction.user.id, Date.now() + duration);
      } else {
        return command.coolDowns.delete(interaction.user.id);
      }
    }
    other.setCoolDown = setCoolDown;

    if (command.coolDown > 0) {
      setCoolDown(command.coolDown);
    }

    if (command.guildOnly && command.perms.bot.length != 0 && !command.perms.bot.every(perm => interaction.guild.me.permissions.has(perm))) {
      config.userErrors.botPermsRequired(interaction, command, command.perms.bot);
      return;
    }

    if (command.guildOnly && command.perms.user.length != 0 && !command.perms.user.every(perm => interaction.member.permissions.has(perm))) {
      config.userErrors.userPermsRequired(interaction, command, command.perms.user);
      return;
    }

    (async () => {
      let shouldRun2 = await config.onCommand(command, interaction, other);
      if (!shouldRun2) return;
      await command.onCommand(interaction, other);
    })();

    return;
  })

  {
    /** @type {Map<string, (import("./types/Event"))[]>} */
    let eventsMapped = global.events.reduce((all, cur) => {
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
          setTimeout(() => {
            chillout.forEach(events, (event) => {
              if (!event.disabled) {
                event.onEvent(...args);
              }
            });
          },0)
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



