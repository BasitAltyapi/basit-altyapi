require("./other/patchConsoleLog");
const { plsParseArgs } = require('plsargs');
const argv = plsParseArgs(process.argv.slice(2));
const chillout = require("chillout");
const { makeSureFolderExists, sleep } = require("stuffs");
const path = require("path");
const readdirRecursive = require("recursive-readdir");
const config = require("./config");
const Discord = require("discord.js");

globalThis.Underline = {
  config,
  Interaction: require('./types/Interaction'),
  Event: require('./types/Event'),
  SlashCommand: require("./types/SlashCommand"),
  SlashSubCommand: require("./types/SlashSubCommand"),
  MessageAction: require("./types/MessageAction"),
  UserAction: require("./types/UserAction"),
};

(async () => {

  /** @type {"guild"|"global"} */
  const LOAD_TYPE = argv.get(0);
  if (!["guild", "global"].includes(LOAD_TYPE)) {
    console.error("[HATA] Geçersiz yükleme tipi seçilmiş. Kullanım: node publishInteractions.js <guild/global>");
    process.exit(-1);
  }
  const GUILD_ID = LOAD_TYPE == "guild" ? !!argv.get(1) ? argv.get(1) : undefined : undefined;

  const isClearMode = LOAD_TYPE == "guild" ? argv.get(2) == "clear" : argv.get(1) == "clear";

  const client = new Discord.Client(config.clientOptions);
  
  if (LOAD_TYPE == "guild" && !GUILD_ID) {
    console.error("[HATA] Sunucu modunda sunucu idsi belirtilmemiş. Kullanım: node publishInteractions.js guild <guildid>");
    process.exit(-1);
  }

  if (GUILD_ID) {
    console.info(`[BİLGİ] ${GUILD_ID} idli sunucu için interaksiyon yüklemsi başlatılıyor..`)
  } else {
    console.info(`[BİLGİ] Tüm sunucular için interaksiyon yüklemsi başlatılıyor..`)
  }
  
  /** @type {Map<string, import("./types/Interaction")>} */
  let commands = new Map();

  if (!isClearMode) {
    let commandsPath = path.resolve("./interactions");
    await makeSureFolderExists(commandsPath);

    let commandFiles = await readdirRecursive(commandsPath);

    commandFiles = commandFiles.filter(i => {
      let state = path.basename(i).startsWith("-");
      if (state) console.warn(`[UYARI] "${i}" dosyası tire ile başladığı için liste dışı bırakıldı.`);
      return !state;
    });

    await chillout.forEach(commandFiles, (interactionFile) => {
      let start = Date.now();
      let rltPath = path.relative(__dirname, interactionFile);
      console.info(`[BİLGİ] "${rltPath}" interaksiyon okunuyor..`)
      /** @type {import("./types/Interaction")} */
      let interaction = require(interactionFile);
      

      if (interaction?._type != "interaction") {
        console.warn(`[UYARI] "${rltPath}" interaksiyon dosyası boş. Atlanıyor..`);
        return;
      }

      if (!interaction.type) {
        console.warn(`[UYARI] "${rltPath}" interaksiyon dosyasın için bir type belirtilmemiş. Atlanıyor.`);
        return;
      }

      if (!interaction.id) {
        console.warn(`[UYARI] "${rltPath}" interaksiyon dosyasının bir idsi bulunmuyor. Atlanıyor..`);
        return;
      }

      if (typeof interaction.name != "string") {
        console.warn(`[UYARI] "${rltPath}" interaksiyon dosyasının bir ismi bulunmuyor. Atlanıyor..`);
        return;
      }
      if (interaction.actionType == "CHAT_INPUT") interaction.name = interaction.name.replace(/ /g, "").toLowerCase();

      if (interaction.type == "SUB_COMMAND" && interaction.actionType != "CHAT_INPUT") {
        console.warn(`[UYARI] "${rltPath}" "SUB_COMMAND" tipi ile sadece "CHAT_INPUT" aksiyon tipi birlikte kullanılabilir. Atlanıyor..`);
        return;
      }

      if (interaction.type == "SUB_COMMAND" && !interaction.subName) {
        console.warn(`[UYARI] "${rltPath}" interaksiyon dosyasının tipi "SUB_COMMAND" ancak bir subName bulundurmuyor. Atlanıyor..`);
        return;
      }


      if (commands.has(interaction.id)) {
        console.warn(`[UYARI] "${interaction.id}" idli bir interaksiyon daha önceden zaten yüklenmiş. Atlanıyor.`)
        return;
      }

      if (interaction.actionType == "CHAT_INPUT" && !interaction.description) {
        console.warn(`[UYARI] "${rltPath}" interaksiyon dosyasının "CHAT_INPUT" aksiyon tipinde ve açıklama içermiyor. Atlanıyor..`)
        return;
      }

      {
        let err = false;
        interaction.options.forEach(i => {
          if (i.name != i.name.toLowerCase()) {
            console.error(`[HATA] "${rltPath}" interaksiyon dosyasının, "${i.name}" adlı opsiyon ismi tamamen küçük haflerden oluşmalı. Atlanıyor..`);
            err = true;
          }
          if (i.name.includes(" ")) {
            console.error(`[HATA] "${rltPath}" interaksiyon dosyasının, "${i.name}" adlı opsiyon ismi boşluk içeremez. Atlanıyor..`);
            err = true;
          }
        });
        if (err) return;
      }

      commands.set(interaction.id, interaction);
      console.info(`[BİLGİ] ("${rltPath}") "${interaction.name}" (${interaction.id}) adlı interaksiyon okundu. (${Date.now() - start}ms sürdü.)`);
    });

    if (commands.size) {
      console.info(`[BİLGİ] ${commands.size} interaksiyon okundu.`);
    } else {
      console.error(`[HATA] Hiçbir interaksiyon yüklenmedi, herşey yolunda mı?`);
    }
  } else {
    console.info(`[BILGI] Temizleme modu açık olduğu için hiç bir interaksiyon yüklenmedi!`);
  }
  
  /** @type {import("discord.js").ApplicationInteractionData[]} */
  let commandData = [];


  if (!isClearMode) {
    console.info(`[BILGI] interaksiyonlar discord'un anlayacağı dile çevriliyor..`);
    /** @type {Map<string, import("./types/Interaction")[]>} */
    let subCommands = new Map();
    [...commands.values()].forEach((cmd) => {
      if (cmd.type == "COMMAND") {
        commandData.push({
          name: cmd.name,
          description: cmd.description,
          options: cmd.options,
          defaultPermission: cmd.defaultPermission,
          type: cmd.actionType
        });
        console.info(`[BILGI] Normal interaksiyon "/${cmd.name}" (${cmd.actionType}) dönüştürüldü.`);
      } else if (cmd.type == "SUB_COMMAND") {
        if (!subCommands.has(cmd.name)) subCommands.set(cmd.name, []);
        subCommands.get(cmd.name).push(cmd);
        console.info(`[BILGI] Sub interaksiyon "/${cmd.name} ${cmd.subName}" ikinci aşama için listeye eklendi.`);
      }
    })

    console.info(`[BILGI] Sub interaksiyonlar için ikin aşama başlıyor..`);
    subCommands.forEach((cmds, cmdName) => {
      commandData.push({
        type: cmds[0].actionType,
        name: cmdName,
        description: `${cmdName} command.`,
        defaultPermission: cmds[0].defaultPermission,
        options: cmds.map(i => {
          console.info(`[BILGI] Sub interaksiyon "/${cmdName} ${i.subName}" dönüştürldü.`);
          return {
            type: "SUB_COMMAND",
            description: i.description,
            name: i.subName,
            options: i.options
          }
        })
      });
    })
  }

  console.info("[BİLGİ] Discord hesabına giriş yapılıyor..");
  await client.login(config.clientToken);
  console.info("[BİLGİ] Discord hesabına giriş yapıldı.");

  console.info("[BİLGİ] interaksiyonlar gönderiliyor..");

  try {
    if (GUILD_ID) {
      
      // let oldCommands = [...(await client.guilds.cache.get(GUILD_ID).commands.fetch()).entries()];
      
      // console.info(`[BİLGİ] ${GUILD_ID} idli sunucunun interaksiyonları temizleniyor..`);
      // for (let i = 0; i < oldCommands.length; i++) {
      //   const [oldCommandId, oldCommand] = oldCommands[i];
      //   await oldCommand.delete();
      //   console.info(`[BİLGİ] ${oldCommand.name} isimli interaksiyon silindi.`);
      // }

      console.info(`[BİLGİ] ${GUILD_ID} idli sunucunun interaksiyonları gönderiliyor..`);
      await client.guilds.cache.get(GUILD_ID).commands.set(commandData);
      console.info(`[BİLGİ] ${GUILD_ID} idli sunucunun interaksiyonları gönderildi!`);
      console.warn(`[UYARI] ${GUILD_ID} idli sunucuya interaksiyonların gelmesi 5 ila 10 saniye sürebilir. Bu süre discord tarafından verilmiştir.`);
    } else {
      console.info("[BİLGİ] Global interaksiyonlar gönderiliyor..");
      await client.application.commands.set(commandData);
      console.info("[BİLGİ] Global interaksiyonlar gönderildi!");
      console.warn("[UYARI] Global yükleme yaptığınız için bütün sunucular interaksiyonların gelmesi 1 saat kadar sürebilir. Bu süre discord tarafından verilmiştir.");
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


