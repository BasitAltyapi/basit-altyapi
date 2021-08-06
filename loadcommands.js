require("./other/patchConsoleLog");
const { plsParseArgs } = require('plsargs');
const argv = plsParseArgs(process.argv.slice(2));
const chillout = require("chillout");
const { makeSureFolderExists, sleep } = require("stuffs");
const path = require("path");
const readdirRecursive = require("recursive-readdir");
const config = require("./config");
const Discord = require("discord.js");

global.config = config;

(async () => {

  /** @type {"guild"|"global"} */
  const LOAD_TYPE = argv.get(0);
  if (!["guild", "global"].includes(LOAD_TYPE)) {
    console.error("[HATA] Geçersiz yükleme tipi seçilmiş. Kullanım: node loadcommands.js <guild/global>");
    process.exit(-1);
  }
  const GUILD_ID = LOAD_TYPE == "guild" ? !!argv.get(1) ? argv.get(1) : undefined : undefined;
  const client = new Discord.Client(config.clientOptions);
  
  if (LOAD_TYPE == "guild" && !GUILD_ID) {
    console.error("[HATA] Sunucu modunda sunucu idsi belirtilmemiş. Kullanım: node loadcommands.js guild <guildid>");
    process.exit(-1);
  }

  if (GUILD_ID) {
    console.info(`[BİLGİ] ${GUILD_ID} idli sunucu için komut yüklemsi başlatılıyor..`)
  } else {
    console.info(`[BİLGİ] Tüm sunucular için komut yüklemsi başlatılıyor..`)
  }

  let commandsPath = path.resolve("./commands");
  await makeSureFolderExists(commandsPath);

  let commandFiles = await readdirRecursive(commandsPath);

  commandFiles = commandFiles.filter(i => {
    let state = path.basename(i).startsWith("-");
    if (state) console.warn(`[UYARI] "${i}" dosyası tire ile başladığı için liste dışı bırakıldı.`);
    return !state;
  });

  /** @type {Map<string, import("./types/Command")>} */
  let commands = new Map();

  await chillout.forEach(commandFiles, (commandFile) => {
    let start = Date.now();
    console.info(`[BİLGİ] "${commandFile}" komut okunuyor..`)
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


    if (commands.has(command.id)) {
      console.warn(`[UYARI] "${command.id}" idli bir komut daha önceden zaten yüklenmiş. Atlanıyor.`)
      return;
    }
  
    if (!command.description) {
      console.warn(`[UYARI] "${command.name}" adlı komut açıklama içermiyor. Atlanıyor..`)
      return;
    }

    {
      let err = false;
      command.options.forEach(i => {
        if (i.name != i.name.toLowerCase()) {
          console.error(`[HATA] "${command.name}" adlı komutun, "${i.name}" adlı opsiyon ismi tamamen küçük haflerden oluşmalı. Atlanıyor..`);
          err = true;
        }
        if (i.name.includes(" ")) {
          console.error(`[HATA] "${command.name}" adlı komutun, "${i.name}" adlı opsiyon ismi boşluk içeremez. Atlanıyor..`);
          err = true;
        }
      });
      if (err) return;
    }

    commands.set(command.id, command);
    console.info(`[BİLGİ] "${command.name}" (${command.id}) adlı komut okundu. (${Date.now() - start}ms sürdü.)`);
  });

  if (commands.size) {
    console.info(`[BİLGİ] ${commands.size} komut okundu.`);
  } else {
    console.error(`[HATA] Hiçbir komut yüklenmedi, herşey yolunda mı?`);
  }


  console.info(`[BILGI] Komutlar discord'un anlayacağı dile çevriliyor..`);
  /** @type {import("discord.js").ApplicationCommandData[]} */
  let commandData = [];
  /** @type {Map<string, import("./types/Command")[]>} */
  let subCommands = new Map();
  [...commands.values()].forEach((cmd) => {
    if (cmd.type == "COMMAND") {
      commandData.push({
        name: cmd.name,
        description: cmd.description,
        options: cmd.options,
        defaultPermission: cmd.defaultPermission
      });
      console.info(`[BILGI] Normal komut "/${cmd.name}" dönüştürüldü.`);
    } else if (cmd.type == "SUB_COMMAND") {
      if (!subCommands.has(cmd.name)) subCommands.set(cmd.name, []);
      subCommands.get(cmd.name).push(cmd);
      console.info(`[BILGI] Sub komut "/${cmd.name} ${cmd.subName}" ikinci aşama için listeye eklendi.`);
    }
  })

  console.info(`[BILGI] Sub komutlar için ikin aşama başlıyor..`);
  subCommands.forEach((cmds, cmdName) => {
    commandData.push({
      name: cmdName,
      description: `${cmdName} command.`,
      defaultPermission: cmds[0].defaultPermission,
      options: cmds.map(i => {
        console.info(`[BILGI] Sub komut "/${cmdName} ${i.subName}" dönüştürldü.`);
        return {
          type: "SUB_COMMAND",
          description: i.description,
          name: i.subName,
          options: i.options
        }
      })
    });
  })

  console.info("[BİLGİ] Discord hesabına giriş yapılıyor..");
  await client.login(config.clientToken);
  console.info("[BİLGİ] Discord hesabına giriş yapıldı.");

  console.info("[BİLGİ] Komutlar gönderiliyor..");

  try {
    if (GUILD_ID) {
      
      // let oldCommands = [...(await client.guilds.cache.get(GUILD_ID).commands.fetch()).entries()];
      
      // console.info(`[BİLGİ] ${GUILD_ID} idli sunucunun komutları temizleniyor..`);
      // for (let i = 0; i < oldCommands.length; i++) {
      //   const [oldCommandId, oldCommand] = oldCommands[i];
      //   await oldCommand.delete();
      //   console.info(`[BİLGİ] ${oldCommand.name} isimli komut silindi.`);
      // }

      console.info(`[BİLGİ] ${GUILD_ID} idli sunucunun komutları gönderiliyor..`);
      await client.guilds.cache.get(GUILD_ID).commands.set(commandData);
      console.info(`[BİLGİ] ${GUILD_ID} idli sunucunun komutları gönderildi!`);
      console.warn(`[UYARI] ${GUILD_ID} idli sunucuya komutların gelmesi 5 ila 10 saniye sürebilir. Bu süre discord tarafından verilmiştir.`);
    } else {
      console.info("[BİLGİ] Global komutlar gönderiliyor..");
      await client.application.commands.set(commandData);
      console.info("[BİLGİ] Global komutlar gönderildi!");
      console.warn("[UYARI] Global yükleme yaptığınız için bütün sunucular komutların gelmesi 1 saat kadar sürebilir. Bu süre discord tarafından verilmiştir.");
    }
  } catch (err) {
    console.error("[HATA] Birşeyler çok yanlış gitti!");
    console.error(err);
    if (`${err}`.toLowerCase().includes("missing access")) console.warn(`[UYARI] Botu sunucunuza eklerken "applications.commands" scope'unu verdiniz değilmi?`);
    process.exit(-1);
  }
  
  await sleep(3000);
  client.destroy();
  console.info("[BİLGİ] İşlemler tamamlandı.");
})();


