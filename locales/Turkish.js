module.exports = new Underline.Locale({
  locale: "tr",
  data: {
    userErrors: {
      coolDown: {
        user: `Bu interaksiyonu sen tekrardan {0} saniye içerisinde kullanabilirsin.`,
        member: `Bu interaksiyonu sen bu sunucuda tekrardan {0} saniye içerisinde kullanabilirsin.`,
        guild: `Bu interaksiyonu bu sunucuda tekrardan {0} saniye içerisinde kullanabilirsin.`,
        channel: `Bu interaksiyonu bu kanalda tekrardan {0} saniye içerisinde kullanabilirsin.`,
        message: `Bu interaksiyonu bu mesajda tekrardan {0} saniye içerisinde kullanabilirsin.`,
        any: `Bu interaksiyonu tekrardan {0} saniye içerisinde kullanabilirsin.`,
      },
      disabled: "Bu interkasiyon kapalı",
      blocked: "Bottan yasaklısınız.",
      guildOnly: "Bu sunuculara özel bir interaksiyon.",
      developerOnly: "Bu interaksiyon sadece bot geliştiricilerine özel",
      guildOwnerOnly: "Bu interaksiyon sadece sunucu sahipleri kullanabilir",
      botPermsRequired: "Botun bu komutu kullanması için {0} yetkilerine ihtiyacı vardır.",
      userPermsRequired: "Bu komutu kullanmak için {0} yetkilerine ihtiyacın var.",
    },
    example: {
      success: "✔ Yeniden yükleme işlemi başarılı.",
      error: "Malesef {0} sunucusunda paylaşılamadı..."
    }
  }
});
