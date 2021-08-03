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
  if (![ "guild", "global" ].includes(LOAD_TYPE)) {
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

  /** @type {Map<import("./types/Command")>} */
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

    if (typeof command.name != "string") command.name = path.basename(commandFile).slice(0, -3).replace(/ /g, "").toLowerCase();

    console.info(`[BILGI] "${commandFile}" -> /${command.name}`);

    if (commands.has(command.name)) {
      console.warn(`[UYARI] "${command.name}" adlı bir komut daha önceden zaten yüklenmiş. Atlanıyor..`)
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

    commands.set(command.name, command);
    console.info(`[BİLGİ] "${command.name}" adlı komut okundu. (${Date.now() - start}ms sürdü.)`);
  });

  if (commands.size) {
    console.info(`[BİLGİ] ${commands.size} komut okundu.`);
  } else {
    console.error(`[HATA] Hiçbir komut yüklenmedi, herşey yolunda mı?`);
  }

  console.info("[BİLGİ] Discord hesabına giriş yapılıyor..");
  await client.login(config.clientToken);
  console.info("[BİLGİ] Discord hesabına giriş yapıldı.");

  console.info("[BİLGİ] Komut şekilleri oluşturuluyor.");

  const commandData = [...commands.values()].map(cmd => {
    let shape = {
      name: cmd.name,
      description: cmd.description,
      options: cmd.options
    };
    console.info(`[BİLGİ] Komut: ${cmd.name}`, shape);
    return shape;
  })

  if (GUILD_ID) {
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
  
  await sleep(3000);
  client.destroy();
  console.info("[BİLGİ] İşlemler tamamlandı.");
})();


