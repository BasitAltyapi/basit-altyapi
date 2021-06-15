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
global.config = config;


(async () => {
  let commandsPath = path.resolve("./commands");
  await makeSureFolderExists(commandsPath);
  await makeSureFolderExists(path.resolve("./events"));

  let commandFiles = await readdirRecursive(commandsPath);

  let commandLoadStart = Date.now();

  await chillout.forEach(commandFiles, (commandFile) => {
    let start = Date.now();
    console.info(`[BİLGİ] "${commandFile}" komut yükleniyor..`)
    /** @type {import("./types/Command")} */
    let command = require(commandFile);

    if (typeof command.name != "string") command.name = path.basename(commandFile).slice(0,-3);
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
    if (typeof command.onLoad == "function") command.onLoad(client);
    console.info(`[BİLGİ] "${command.name}" adlı komut yüklendi. (${Date.now() - start}ms sürdü.)`);
  });

  if (global.commands.size) {
    console.info(`[BİLGİ] ${global.commands.size} komut yüklendi. (${Date.now() - commandLoadStart}ms sürdü.)`);
  } else {
    console.warn(`[UYARI] Hiçbir komut yüklenmedi, herşey yolunda mı? (${Date.now() - commandLoadStart}ms sürdü.)`);
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
        
        if (config.blockedUsers.has(message.author.id)) {
          config.messages.blocked(message, command);
          return;
        }

        if (command.disabled) {
          config.messages.disabled(message, command);
          return;
        }

        if (command.guildOnly && command.perms.bot.length != 0 && !command.perms.bot.every(perm => message.guild.me.permissions.has(perm))) {
          config.messages.botPermsRequired(message, command, command.perms.bot);
          return;
        }

        if (command.guildOnly && command.perms.user.length != 0 && !command.perms.user.every(perm => message.member.permissions.has(perm))) {
          config.messages.userPermsRequired(message, command, command.perms.user);
          return;
        }

        let userCooldown = command.coolDowns.get(message.author.id) || 0;
        if (Date.now() < userCooldown) {
          config.messages.timeout(message, command, userCooldown - Date.now());
          return;
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

  commandLoadStart = 0;

  client.login(config.clientToken);
})();



