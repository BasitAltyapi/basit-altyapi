const Discord = require('discord.js');

module.exports = new (require("./types/Config"))({
  // E tabi, bot tokeni buraya.
  clientToken: "ODI0MjEwMTMyMzUwMDA5MzY2.YFsDgA.QZA9ag6cdT_lSx8ovBruYvmDnqU",
  // Yasaklı kullanıcıların idleri.
  blockedUsers: new Set([

  ]),
  // Geliştiricilerin idleri.
  developers: new Set([
    "707309693449535599"
  ]),
  // Discord.js client ayarları.
  clientOptions: {
    // Okumanızı tavsiye ederim: https://discordjs.guide/popular-topics/intents.html
    intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_MEMBERS", "GUILD_WEBHOOKS"]
  },
  // Kullanıcı hatalarındaki uyarı mesajları/olayları.
  userErrors: {
    // Arka arkaya komut kullanma limiti aşıldığında.
    coolDown(interaction, command, coolDown) {
      interaction.reply(`Bu komutu tekrardan ${(coolDown / 1000).toFixed(2)} saniye içerisinde kullanabilirsin.`)
    },
    // Komut kapalı olduğunda
    disabled(interaction, command) {
      interaction.reply("Bu komut kapalı.");
    },
    // Kullanıcı bottan yasaklı olduğunda.
    blocked(interaction, command) {
      interaction.reply("Bottan yasaklanmışsınız.");
    },
    // Botun çalışmak için x yertkilerine ihtiyacı olduğunda.
    botPermsRequired(interaction, command, perms) {
      interaction.reply(`Bu komutun çalışması için ${perms.join(", ")} yetkilerine ihtiyacım var.`)
    },
    // Kullanıcının komutu kullanabilmek için x yetkilerine ihtiyacı olduğunda.
    userPermsRequired(interaction, command, perms) {
      interaction.reply(`Bu komutu kullanabilmek için ${perms.join(", ")} yetkilerine ihtiyacın var.`)
    },
    // Komut sadece geliştiricilere özel olduğunda.
    developerOnly(interaction, command) {
      interaction.reply(`Bu komutu sadece bot geliştiricileri kullanabilir.`)
    },
    guildOnly(interaction, command) {
      interaction.reply(`Bu komutu sadece sunucularda kullanılabilir.`)
    }
  },
  // Diğer ayarlar. Bunun içine ne isterseniz koyabilirsiniz.
  // Ulaşmak için "global.config.other" objesini kullanabilirsiniz.
  other: {},
  // Her komutun varsayılan ayarları her anahtarın ne
  // işe yaradığını merak ediyorsanız commands/ornekKomut.js'e
  // bakabilirsiniz.
  commandDefaults: {
    description: "Açıkla belirtilmemiş.",
    developerOnly: false,
    guildOnly: true,
    disabled: false,
    coolDown: -1,
    other: {},
    perms: {
      bot: [],
      user: []
    },
    options: [],
    defaultPermission: true
  },
  // Bot ilk açıldığında daha hiçbirşey yüklenmeden önce çalışan fonksiyon. Opsiyonel.
  onBeforeLoad(client) {
    console.log("[CONFIG] Yüklemeye başlamadan önce çalıştı.");
  },
  // Bot komutları ve olayları yükledikten sonra çalışan fonksiyon. Opsiyonel.
  onAfterLoad(client) {
    console.log("[CONFIG] Yükleme bittikten sonra çalıştı.");
  },
  // Bot açıldıktan sonra kullanıma hazır olduktan sonra çalışan fonksiyon. Opsiyonel.
  async onReady(client) {
    console.log("[CONFIG] Discord hesabına giriş yaptıktan sonra çalıştı.");
    client.user.setActivity(`/help - Basit Altyapı by TheArmagan`, { type: "WATCHING" });

  },
  // Komut üzerinde hiçbir kontrol yapılmadan önce çalışır.
  // Sadece cevap true ise işleme devam eder.
  async onCommandBeforeChecks(command, interaction) {
    return true;
  },
  // Komuttaki bütün kontrolleri geçtikten sonra, komut
  // hemen çalıştırılmadan önce çalışır.
  // Sadece cevap true ise işleme devam eder.
  //
  // Other objesini istediğiniz gibi modifiye edebilirsiniz.
  // Nasılsa altakki fonksiyon her komut çalışmadan önce çalışır.
  async onCommand(command, interaction, other) {
    return true;
  }
})