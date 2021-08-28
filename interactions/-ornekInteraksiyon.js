module.exports = new Underline.Interaction({
  // interaksiyon tipi. COMMAND veya SUB_COMMAND. Gerekli
  // interaksiyon tipi SUB_COMMAND olması durumunda subName değeri vermek zoundasınız.
  // Subinteraksiyon örnekleri için moderasyon interaksiyonlarına bakabilirsiniz.
  type: "COMMAND",
  // interaksiyonun idsi. Opsiyonel, boş bırakıldığında {type}:{name}:{subName} formatı ile kayıt olur.
  // Boşluk içeremez.
  id: "ornekinteraksiyon",
  // interaksiyonun kullanıcıya gözüken ismi. Opsiyonel, boş bırakıldığında dosya ismini alır.
  // Boşluk içeremez. Bu interaksiyon kullanıcıya /onnekinteraksiyon şeklinde gözükecektir.
  // Boşluk, büyük harf, türkçe harf içeremez.
  name: "ornekinteraksiyon",
  // onInteraction fonksiyonu her interaksiyon kullanıldığında çağrılır.
  onInteraction(interaction, other) {
    // Discord.js CommandInteraction objesi.
    interaction;
    
    // Tek seferlik olarak coolDown değiştirmek için kullanılır.
    other.setCoolDown(5000);

    interaction.reply("Merhaba!");
  },
  // interaksiyon çalışmaya hazır olduğunda sadece bot açılırken bir
  // kereliğine çağrılır. Opsiyonel.
  onLoad(client) {
    // Normal discord.js Client objesi
    client;
  },
  // interaksiyon açıklaması, Gerekli.
  description: "Örnek interaksiyon.",
  // Sadece bot geliştiricilerine özelmi değil mi?
  // Opsiyonel. Varsayılan olarak false.
  developerOnly: true,
  // interaksiyon kullanıma genel olarak kapalı mı?
  // Opsiyonel. Varsayılan olarak false.
  disabled: false,
  // Arka arkaya varsayılan interaksiyon kullanma süre limiti.
  // Opsiyonel. Varsayılan olarak 0.
  // Bu değer other.setCoolDown(1000) fonksiyonu olarak işlem başına değiştirilebilir.
  coolDown: 1000,
  // İstediğiniz interaksiyon ile alakalı diğer bütün dataları burada tutabilirsiniz.
  // Opsiyonel. Varsayılan olarak {}.
  other: {},
  // interaksiyon yetkileri
  // Opsiyonel. Varsayılan olarak {bot: [], user: []}.
  perms: {
    // interaksiyonun çalışması için bot'a gerekli olan yetkiler.
    bot: ["SEND_MESSAGES"],
    // interaksiyonun çalışması için kullanıcıya gerekli olan yetkiler.
    user: []
  },
  // Slash interaksiyon opsiyonları.
  // Daha fazla örnek için diğer interaksiyon dosylarına bakabilirsiniz.
  options: [],
  // Slash interaksiyon varsayılan olarak sunucudaki
  // gözüksün mü gözükmesin mi? Opsiyonel.
  // Bunun false olması durumunda interaksiyonlar dmlerde
  // kullanılmaz hale gelir. Ek olarak sunucunun admini
  // olsanız bile kullanamazsınız. Daha fazla bilgi için
  // discord.js guilde sitesine bakabilirsiniz: 
  // https://discordjs.guide/interactions/slash-command-permissions.html
  defaultPermission: true
})