module.exports = new Underline.ChatInput({
  // Slash komutun kullanıcıya gözüken ismi. Bu isim bir arraydır (liste)
  // Bu liste en fazla 3 uzunlukta olabilir. Örneğin;
  // ["muüzik", "çal"] kullanıcıya /müzik çal olarak gözükecektir.
  // veya ["muüzik", "liste", "temizle"] kullanıcıya /müzik liste temizle
  // olarak gözükecektir.
  name: ["örnekiteraksiyon"],
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
  // Bu değer other.setCoolDown(1000, "user") fonksiyonu olarak işlem başına değiştirilebilir.
  coolDown: {
    amount: 1000,
    type: "user"
  },
  // İstediğiniz interaksiyon ile alakalı diğer bütün dataları burada tutabilirsiniz.
  // Opsiyonel. Varsayılan olarak {}.
  other: {},
  // interaksiyon yetkileri
  // Opsiyonel. Varsayılan olarak {bot: [], user: []}.
  perms: {
    // interaksiyonun çalışması için bot'a gerekli olan yetkiler.
    bot: ["SendMessages"],
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