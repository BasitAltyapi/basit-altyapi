require("./other/patchConsoleLog");
const config = require("./config");
const Discord = require("discord.js");
const chillout = require("chillout");
const path = require("path");
const readdirRecursive = require("recursive-readdir");
const { makeSureFolderExists } = require("stuffs");
const client = new Discord.Client(config.clientOptions);

const interactions = new Discord.Collection();
const events = new Discord.Collection();

globalThis.Underline = {
  config,
  client,
  interactions,
  events,
  Interaction: require('./types/Interaction'),
  Event: require('./types/Event'),
  SlashCommand: require("./types/SlashCommand"),
  MessageAction: require("./types/MessageAction"),
  UserAction: require("./types/UserAction"),
}

console.info("[BİLGİ] Basit Altyapı v1.8.1 - by Kıraç Armağan Önal");
(async () => {
  let interactionsPath = path.resolve("./interactions");
  await makeSureFolderExists(interactionsPath);
  let eventsPath = path.resolve("./events");
  await makeSureFolderExists(eventsPath);

  await config.onBeforeLoad(client);

  let loadStart = Date.now();
  let interactionFiles = await readdirRecursive(interactionsPath);

  interactionFiles = interactionFiles.filter(i => {
    let state = path.basename(i).startsWith("-");
    if (state) console.warn(`[UYARI] "${i}" dosyası tire ile başladığı için liste dışı bırakıldı.`);
    return !state;
  });
  
  await chillout.forEach(interactionFiles, (interactionFile) => {
    let start = Date.now();
    let rltPath = path.relative(__dirname, interactionFile);
    console.info(`[BİLGİ] "${interactionFile}" konumundaki interaksiyon yükleniyor..`)
    /** @type {import("./types/Interaction")} */
    let uInter = require(interactionFile);

    if (uInter?._type != "interaction") {
      console.warn(`[UYARI] "${rltPath}" interaksiyon dosyası boş. Atlanıyor..`);
      return;
    }

    if (!uInter.id) {
      console.warn(`[UYARI] "${rltPath}" interaksiyon dosyasının bir idsi bulunmuyor. Atlanıyor..`);
      return;
    }

    if (uInter.name.length > 3) {
      console.warn(`[UYARI] "${rltPath}" interaksiyon dosyasının isim listesi çok uzun. (>3) Atlanıyor..`);
      return;
    }

    if (!uInter.name?.length) {
      console.warn(`[UYARI] "${rltPath}" interaksiyon dosyasının bir ismi bulunmuyor. Atlanıyor..`);
      return;
    }

    if (Underline.interactions.has(uInter.id)) {
      console.warn(`[UYARI] "${uInter.id}" idli bir interaksiyon daha önceden zaten yüklenmiş. Atlanıyor.`)
      return;
    }

    if (typeof uInter.onInteraction != "function") {
      console.error(`[HATA] "${rltPath}" interaksiyon dosyası geçerli bir onInteraction fonksiyonuna sahip değil! Atlanıyor.`);
      return;
    };

    if (!uInter.guildOnly && (uInter.perms.bot.length != 0 || uInter.perms.user.length != 0)) {
      console.warn(`[UYARI] "${rltPath}" interaksiyon dosyası sunuculara özel olmamasına rağmen özel perm kullanıyor.`);
    }


    Underline.interactions.set(uInter.id, uInter);
    uInter.onLoad(client);
    console.info(`[BİLGİ] "${uInter.actionType == "CHAT_INPUT" ? `/${uInter.name.join(" ")}` : `${uInter.name[0]}`}" (${uInter.id}) adlı interaksiyon yüklendi. (${Date.now() - start}ms sürdü.)`);
  });

  if (Underline.interactions.size) {
    console.info(`[BİLGİ] ${Underline.interactions.size} interaksiyon yüklendi.`);
  } else {
    console.warn(`[UYARI] Hiçbir interaksiyon yüklenmedi, herşey yolunda mı?`);
  }

  let eventFiles = await readdirRecursive(eventsPath);

  eventFiles = eventFiles.filter(i => {
    let state = path.basename(i).startsWith("-");
    if (state) console.warn(`[UYARI] "${i}" dosyası tire ile başladığı için liste dışı bırakıldı.`);
    return !state;
  });

  await chillout.forEach(eventFiles, async (eventFile) => {
    let start = Date.now();
    let rltPath = path.relative(__dirname, eventFile);
    console.info(`[BİLGİ] "${eventFile}" event yükleniyor..`);

    /** @type {import("./types/Event")} */
    let event = require(eventFile);

    if (event?._type != "event") {
      console.warn(`[UYARI] "${rltPath}" event dosyası boş. Atlanıyor..`);
      return;
    }

    if (typeof event.id != "string") event.id = path.basename(eventFile).slice(0, -3).replace(/ /g, "");

    if (Underline.events.has(event.id)) {
      console.warn(`[UYARI] "${event.id}" adlı bir event daha önceden zaten yüklenmiş. Atlanıyor.`);
      return;
    }

    if (typeof event.onEvent != "function") {
      console.error(`[HATA] "${rltPath}" olay dosyası geçerli bir onEvent fonksiyonuna sahip değil! Atlanıyor.`);
      return;
    };

    Underline.events.set(event.id, event);
    event.onLoad(client);
    console.info(`[BİLGİ] ("${rltPath}") "${event.id}" adlı event yüklendi. (${Date.now() - start}ms sürdü.)`);
  })

  if (Underline.events.size) {
    console.info(`[BİLGİ] ${Underline.events.size} event yüklendi.`);
  } else {
    console.warn(`[UYARI] Hiçbir olay yüklenmedi, herşey yolunda mı?`);
  }

  client.on("interactionCreate", async (interaction) => {
    if (!(interaction.isCommand() || interaction.isContextMenu())) return;
    
    let subCommandName = "";
    try {subCommandName = interaction.options.getSubcommand();} catch { };
    let subCommandGroupName = "";
    try {subCommandGroupName = interaction.options.getSubcommandGroup();} catch { };

    let command = Underline.interactions.find(uInter => {
      switch (uInter.name.length) {
        case 1: return uInter.name[0] == interaction.commandName;
        case 2: return uInter.name[0] == interaction.commandName && uInter.name[1] == subCommandName;
        case 3: return uInter.name[0] == interaction.commandName && uInter.name[1] == subCommandGroupName && uInter.name[2] == subCommandName;
      }
    });

    if (!command) return;

    if (config.autoDefer) interaction.defer();

    let shouldRun1 = await config.onInteractionBeforeChecks(command, interaction);

    if (!shouldRun1) return;

    if (command.developerOnly && !config.developers.has(interaction.user.id)) {
      config.userErrors.developerOnly(interaction, command);
      return;
    }

    if (command.disabled) {
      config.userErrors.disabled(interaction, command);
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
      let shouldRun2 = await config.onInteraction(command, interaction, other);
      if (!shouldRun2) return;
      await command.onInteraction(interaction, other);
    })();

    return;
  })

  {
    /** @type {Map<string, (import("./types/Event"))[]>} */
    let eventsMapped = Underline.events.reduce((all, cur) => {
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

  interactionFiles = 0;
  eventFiles = 0;
  loadStart = 0;

  await config.onAfterLoad(client);

  await client.login(config.clientToken);
  console.info("[BİLGİ] Discord'a bağlanıldı!", client.user.tag);

  config.onReady(client);
})();



