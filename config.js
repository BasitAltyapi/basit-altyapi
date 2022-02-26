module.exports = new (require("./types/Config"))({
  // E tabi, bot tokeni buraya.
  clientToken: "ODI0MjEwMTMyMzUwMDA5MzY2.YFsDgA.qPbnFZ6yuUvob43hrXJ43SxAbRg",
  // Yasaklı kullanıcıların idleri.
  blockedUsers: new Set([]),
  // Geliştiricilerin idleri.
  developers: new Set([
    "707309693449535599",
    "319862027571036161"
  ]),
  // 0: No Debug, 1: Minimal Debug 2: Maximum Debug
  debugLevel: 2,
  // Discord.js client ayarları.
  clientOptions: {
    // Okumanızı tavsiye ederim: https://discordjs.guide/popular-topics/intents.html
    intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_MEMBERS", "GUILD_WEBHOOKS"]
  },
  // Botunuzun varsayılan dili.
  defaultLanguage: "tr",
  // Diğer ayarlar. Bunun içine ne isterseniz koyabilirsiniz.
  // Ulaşmak için "Underline.config.other" ve/veya "Underline.other" objesini kullanabilirsiniz.
  other: {

  },
  // Otomatik olarak "Underline" objesinin içine eklenen değerler.
  // Eklediğiniz değerler "Underline.<anahtar>" şeklinde ulaşabilirsiniz.
  // Prejeinin herhangi bir yerinde bu işlemi yapabilirsiniz.
  // Bu obje hiçbir filitrelemeden geçmemektedir. "Başınız yanabilir."
  // - Bu özellik other objesinin bi amacı kalmamasını sağlıyor
  globalObjects: {

  },
  // Kullanıcı hatalarındaki uyarı mesajları/olayları.
  userErrors: {
    // Arka arkaya interaksiyon kullanma limiti aşıldığında.
    coolDown(interaction, uInteraction, coolDown, type, other) {
      interaction.reply({
        ephemeral: true,
        content: other.locale.userErrors.coolDown[type]((coolDown / 1000).toFixed(2))
      });
    },
    // interaksiyon kapalı olduğunda
    disabled(interaction, uInteraction, other) {
      if (interaction.isAutocomplete()) return [];
      interaction.reply({ ephemeral: true, content: other.locale.userErrors.disabled() });
    },
    // Kullanıcı bottan yasaklı olduğunda.
    blocked(interaction, uInteraction, other) {
      if (interaction.isAutocomplete()) return [];
      interaction.reply({ ephemeral: true, content: other.locale.userErrors.blocked() });
    },
    // interaksiyon sadece geliştiricilere özel olduğunda.
    developerOnly(interaction, uInteraction, other) {
      if (interaction.isAutocomplete()) return [];
      interaction.reply({ ephemeral: true, content: other.locale.userErrors.developerOnly() });
    },
    // interaksiyon sadece sunucu sahiplerine özel olduğunda.
    guildOwnerOnly(interaction, uInteraction, other) {
      if (interaction.isAutocomplete()) return [];
      interaction.reply({ ephemeral: true, content: other.locale.userErrors.guildOwnerOnly() });
    },
    // interaksiyon sadece sunuculara özel olduğunda.
    guildOnly(interaction, uInteraction, other) {
      if (interaction.isAutocomplete()) return [];
      interaction.reply({ ephemeral: true, content: other.locale.userErrors.guildOnly() });
    },
    // Botun çalışmak için x yertkilerine ihtiyacı olduğunda.
    botPermsRequired(interaction, uInteraction, perms, other) {
      if (interaction.isAutocomplete()) return [];
      interaction.reply({ ephemeral: true, content: other.locale.userErrors.botPermsRequired(perms.join(", ")) });
    },
    // Kullanıcının interaksiyonu kullanabilmek için x yetkilerine ihtiyacı olduğunda.
    userPermsRequired(interaction, uInteraction, perms, other) {
      if (interaction.isAutocomplete()) return [];
      interaction.reply({ ephemeral: true, content: other.locale.userErrors.userPermsRequired(perms.join(", ")) });
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
    defaultPermission: true,
    autoDefer: "off",
    nullError: false
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
  },
  // İnteraksiyon hatasız bir şekilde çalıştıktan sonra tetikleniyor. (Armağan: peki.)
  async onAfterInteraction(uInteraction, interaction, other) { },
  // eventteki bütün kontrolleri geçtikten sonra, event
  // hemen çalıştırılmadan önce çalışır.
  // Sadece cevap true ise işleme devam eder.
  //
  // Other objesini istediğiniz gibi modifiye edebilirsiniz.
  // Nasılsa altakki fonksiyon her event çalışmadan önce çalışır.
  async onEvent(eventName, [arg1, arg2], other) {
    return true;
  },
  // Olay hatasız bir şekilde çalıştıktan sonra çalışır.
  async onAfterEvent(eventName, [arg1, arg2], other) {
    
  },
})
