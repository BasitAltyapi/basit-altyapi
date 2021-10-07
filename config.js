module.exports = new (require("./types/Config"))({
  // E tabi, bot tokeni buraya.
  clientToken: "",
  // Yasaklı kullanıcıların idleri.
  blockedUsers: new Set([]),
  // Geliştiricilerin idleri.
  developers: new Set([
    "707309693449535599"
  ]),
  // Discord.js client ayarları.
  clientOptions: {
    // Okumanızı tavsiye ederim: https://discordjs.guide/popular-topics/intents.html
    intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_MEMBERS", "GUILD_WEBHOOKS"]
  },
  // Diğer ayarlar. Bunun içine ne isterseniz koyabilirsiniz.
  // Ulaşmak için "Underline.config.other" objesini kullanabilirsiniz.
  other: {

  },
  // Kullanıcı hatalarındaki uyarı mesajları/olayları.
  userErrors: {
    // Arka arkaya interaksiyon kullanma limiti aşıldığında.
    coolDown(interaction, uInteraction, coolDown, other) {
      interaction.reply(`Bu interaksiyonu tekrardan ${(coolDown / 1000).toFixed(2)} saniye içerisinde kullanabilirsin.`)
    },
    // interaksiyon kapalı olduğunda
    disabled(interaction, uInteraction, other) {
      interaction.reply("Bu interaksiyon kapalı.");
    },
    // Kullanıcı bottan yasaklı olduğunda.
    blocked(interaction, uInteraction, other) {
      interaction.reply("Bottan yasaklanmışsınız.");
    },
    // interaksiyon sadece geliştiricilere özel olduğunda.
    developerOnly(interaction, uInteraction, other) {
      interaction.reply(`Bu interaksiyonu sadece bot geliştiricileri kullanabilir.`)
    },
    guildOnly(interaction, uInteraction, other) {
      interaction.reply(`Bu interaksiyonu sadece sunucularda kullanılabilir.`)
    },
    // Botun çalışmak için x yertkilerine ihtiyacı olduğunda.
    botPermsRequired(interaction, uInteraction, perms, other) {
      interaction.reply(`Bu interaksiyonun çalışması için ${perms.join(", ")} yetkilerine ihtiyacım var.`)
    },
    // Kullanıcının interaksiyonu kullanabilmek için x yetkilerine ihtiyacı olduğunda.
    userPermsRequired(interaction, uInteraction, perms, other) {
      interaction.reply(`Bu interaksiyonu kullanabilmek için ${perms.join(", ")} yetkilerine ihtiyacın var.`)
    },
  },
  // Her interaksiyonun varsayılan ayarları her anahtarın ne
  // işe yaradığını merak ediyorsanız interactions/ornekInteraksiyon.js'e
  // bakabilirsiniz.
  interactionDefaults: {
    actionType: "CHAT_INPUT",
    description: "...",
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
  // Bot interaksiyonları ve olayları yükledikten sonra çalışan fonksiyon. Opsiyonel.
  onAfterLoad(client) {
    console.log("[CONFIG] Yükleme bittikten sonra çalıştı.");
  },
  // Bot açıldıktan sonra kullanıma hazır olduktan sonra çalışan fonksiyon. Opsiyonel.
  async onReady(client) {
    console.log("[CONFIG] Discord hesabına giriş yaptıktan sonra çalıştı.");
    client.user.setActivity(`/help - Basit Altyapı by TheArmagan`, { type: "WATCHING" });
    
  },
  // interaksiyon üzerinde hiçbir kontrol yapılmadan önce çalışır.
  // Sadece cevap true ise işleme devam eder.
  //
  // Other objesini istediğiniz gibi modifiye edebilirsiniz.
  // Nasılsa altakki fonksiyon her interaksiyon çalışmadan önce çalışır.
  async onInteractionBeforeChecks(uInteraction, interaction, other) {
    return true;
  },
  // interaksiyontaki bütün kontrolleri geçtikten sonra, interaksiyon
  // hemen çalıştırılmadan önce çalışır.
  // Sadece cevap true ise işleme devam eder.
  //
  // Other objesini istediğiniz gibi modifiye edebilirsiniz.
  // Nasılsa altakki fonksiyon her interaksiyon çalışmadan önce çalışır.
  async onInteraction(uInteraction, interaction, other) {
    return true;
  }
})