module.exports = new (require("./types/Config"))({
  // Liste haline bot için kullanılacak ön-ek/preifxler
  prefixes: ["!", "ba!"],
  // E tabi, bot tokeni buraya.
  clientToken: "hot",
  // Yasaklı kullanıcıların idleri.
  blockedUsers: new Set([

  ]),
  // Geliştiricilerin idleri.
  developers: new Set([
    "707309693449535599"
  ]),
  // Discord.js client ayarları.
  clientOptions: {},
  // Kullanıcı hatalarındaki uyarı mesajları/olayları.
  messages: {
    // Arka arkaya komut kullanma limiti aşıldığında.
    coolDown(message, command, coolDown) {
      message.reply(`Bu komutu tekrardan ${(coolDown / 1000).toFixed(2)} saniye içerisinde kullanabilirsin.`).then(m=>m.delete({timeout: 5000}));
      message.react("⏳");
    },
    // Komut kapalı olduğunda
    disabled(message, command) {
      message.react("⭕");
    },
    // Kullanıcı bottan yasaklı olduğunda.
    blocked(message, command) {
      message.react("💥");
    },
    // Botun çalışmak için x yertkilerine ihtiyacı olduğunda.
    botPermsRequired(message, command, perms) {
      message.reply(`Bu komutun çalışması için ${perms.join(", ")} yetkilerine ihtiyacım var.`).then(m => m.delete({ timeout: 5000 }));
    },
    // Kullanıcının komutu kullanabilmek için x yetkilerine ihtiyacı olduğunda.
    userPermsRequired(message, command, perms) {
      message.reply(`Bu komutu kullanabilmek için ${perms.join(", ")} yetkilerine ihtiyacın var.`).then(m => m.delete({ timeout: 5000 }));
    },
    // Komut sadece geliştiricilere özel olduğunda.
    developerOnly(message, command) {
      message.reply(`Bu komutu sadece bot geliştiricileri kullanabilir.`).then(m => m.delete({ timeout: 5000 }));
    },
    // Sunuculara özel olan bir komutu dm'den kullanılmaya çalıştığı zaman.
    guildOnly(message, command) {
      message.reply(`Bu komut sadece sunucularda kullanılabilir.`).then(m => m.delete({ timeout: 5000 }));
    }
  },
  // Diğer ayarlar. Bunun içine ne isterseniz koyabilirsiniz.
  // Ulaşmak için "global.config.other" objesini kullanabilirsiniz.
  other: {},
  // Komut ismini otomatik olarak aliasların içine
  // eklersin mi? Varsayılan true.
  addCommandNameAsAlias: true,
  // Her komutun varsayılan ayarları her anahtarın ne
  // işe yaradığını merak ediyorsanız commands/ornekKomut.js'e
  // bakabilirsiniz.
  commandDefaults: {
    desc: "",
    develoeOnly: false,
    disabled: false,
    coolDown: 0,
    guildOnly: true,
    other: {
      usage: "{p}{alias}"
    },
    perms: {
      bot: ["SEND_MESSAGES"],
      user: []
    }
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
  onReady(client) {
    console.log("[CONFIG] Discord hesabına giriş yaptıktan sonra çalıştı.");
    client.user.setActivity(`${this.prefixes[0]}help`, {type: "WATCHING"})
  }
})