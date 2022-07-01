module.exports = new Underline.Locale({
  locale: "tr",
  data: {
    userErrors: {
      coolDown: {
        user: "Bu interaksiyonu sen tekrardan {0} saniye içerisinde kullanabilirsin.",
        member: "Bu interaksiyonu sen bu sunucuda tekrardan {0} saniye içerisinde kullanabilirsin.",
        guild: "Bu interaksiyonu bu sunucuda tekrardan {0} saniye içerisinde kullanabilirsin.",
        channel: "Bu interaksiyonu bu kanalda tekrardan {0} saniye içerisinde kullanabilirsin.",
        message: "Bu interaksiyonu bu mesajda tekrardan {0} saniye içerisinde kullanabilirsin.",
        any: "Bu interaksiyonu tekrardan {0} saniye içerisinde kullanabilirsin."
      },
      disabled: "Bu interkasiyon kapalı",
      blocked: "Bottan yasaklısınız.",
      guildOnly: "Bu sunuculara özel bir interaksiyon.",
      developerOnly: "Bu interaksiyon sadece bot geliştiricilerine özel",
      guildOwnerOnly: "Bu interaksiyon sadece sunucu sahipleri kullanabilir",
      botPermsRequired: "Botun bu komutu kullanması için {0} yetkilerine ihtiyacı vardır.",
      userPermsRequired: "Bu komutu kullanmak için {0} yetkilerine ihtiyacın var."
    },
    example: {
      success: "✔ Yeniden yükleme işlemi başarılı.",
      error: "Malesef {0} sunucusunda paylaşılamadı..."
    },
    mongooseDatabase: {}
  },
  commands: [
    {
      originalName: ["profil"],
      name: ["profilim"],
      description: "Kullanıcının profilini gösterir."
    },
    {
      originalName: ["unban"],
      name: ["unban"],
      description: "Banlı bir kullanıcının banını açmanızı sağlar."
    },
    {
      originalName: ["buton-yolla"],
      name: ["buton-yolla"],
      description: "Buton yollar"
    },
    {
      originalName: ["eval"],
      name: ["eval"],
      description: "Bot yetkilileri için JavaScript çalıştırma komutu."
    },
    {
      originalName: ["matamatik"],
      name: ["matamatik"],
      description: "Basit 4 işlem sorularını yapmanızı sağlar."
    },
    {
      originalName: ["modal","yolla"],
      name: ["modal","yolla"],
      description: ".."
    },
    {
      originalName: ["reload"],
      name: ["reload"],
      description: "Bot yetkilileri için Underline reload komutu."
    },
    {
      originalName: ["moderasyon","at"],
      name: ["moderasyon","at"],
      description: "Sunucudan üye atmanızı sağlar."
    }
  ]
});