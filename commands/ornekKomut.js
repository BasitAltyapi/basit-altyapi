module.exports = new (require("../types/Command"))({
  // onCommand fonksiyonu her komut kullanıldığında çağrılır.
  onCommand(message, other) {
    // Discord.JS Message objesi.
    message;

    // Mesaj contenti boşluklar ile ayrılmış liste.
    // Örnek:
    // Mesaj: "hello world" "bu bir denemedir" evet --argDeneme "merhaba"
    // Sonuç: ['"hello', 'world"', '"bu', 'bir', 'denemedir"', ...]
    other.args;

    // PlsArgs tarafından ayrıştırılmış args objesi.
    // Örnek:
    // Mesaj: "hello world" "bu bir denemedir" evet --argDeneme "merhaba"
    // Sonuç: 
    // {
    //   raw: {
    //      _: ["hello world", "bu bir denemedir", "evet"], 
    //      argDeneme: "merhaba"
    //   },
    //// Sayı koyulursa alttan tire listesindeki sonuç varmı diye bakar,
    //// yazı koyulursa argument varmı yokmu diye bakar.
    //   has(yazı veya sayı),
    //// Sayı koyulursa alttan tire listesindeki sonucu verir,
    //// yazı koyulursa argument sonucunu verir.
    //   get(yazı veya sayı),
    //   _: raw._ referansı
    // }
    other.plsargs;

    // Komut çalıştırılırken kullanılmış olan isim/yanisim.
    other.usedAlias;

    // Komut çalıştırılırken kullanılmış olan ön-ek/prefix.
    other.usedPrefix;

    // Tek seferlik olarak coolDown değiştirmek için kullanılır.
    other.setCoolDown(5000);

    message.reply("Merhaba!");
  },
  // Komut çalışmaya hazır olduğunda sadece bot açılırken bir
  // kereliğine çağrılır. Opsiyonel.
  onLoad(client) {
    // Normal discord.js Client objesi
    client;
  },
  // Komutun ismi. Opsiyonel, boş bırakıldığında dosya ismini alır.
  // Boşluk içeremez.
  name: "örnekKomut",
  // Yan isimler, komut çağrılırken kullanılan yan isimler.
  // Opsiyonel boş bırakıldığında, komut ismi eklenir listeye.
  // Aliaslar boşluk içeremez.
  aliases: ["diğerKısaYol"],
  // Komut açıklaması, Opsiyonel.
  desc: "Örnek komut.",
  // Sadece bot geliştiricilerine özelmi değil mi?
  // Opsiyonel. Varsayılan olarak false.
  developerOnly: true,
  // Komut kullanıma genel olarak kapalı mı?
  // Opsiyonel. Varsayılan olarak false.
  disabled: false,
  // Arka arkaya varsayılan komut kullanma süre limiti.
  // Opsiyonel. Varsayılan olarak 0.
  // Bu değer other.setCoolDown(1000) fonksiyonu olarak işlem başına değiştirilebilir.
  coolDown: 1000,
  // Komut sadece sunuculara mı özel?
  // Opsiyonel. Varsayılan olarak true.
  guildOnly: true,
  // İstediğiniz komut ile alakalı diğer bütün dataları burada tutabilirsiniz.
  // Opsiyonel. Varsayılan olarak {}.
  other: {},
  // Komut yetkileri
  // Opsiyonel. Varsayılan olarak {bot: [], user: []}.
  perms: {
    // Komutun çalışması için bot'a gerekli olan yetkiler.
    bot: ["SEND_MESSAGES"],
    // Komutun çalışması için kullanıcıya gerekli olan yetkiler.
    user: []
  }
})