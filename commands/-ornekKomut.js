module.exports = new (require("../types/Command"))({
  // Komutun ismi. Opsiyonel, boş bırakıldığında dosya ismini alır.
  // Boşluk içeremez. Bu komut kullanıcıya /onnekkomut şeklinde gözükecektir.
  name: "ornekkomut",
  // onCommand fonksiyonu her komut kullanıldığında çağrılır.
  onCommand(interaction, other) {
    // Discord.js CommandInteraction objesi.
    interaction;
    
    // Tek seferlik olarak coolDown değiştirmek için kullanılır.
    other.setCoolDown(5000);

    interaction.reply("Merhaba!");
  },
  // Komut çalışmaya hazır olduğunda sadece bot açılırken bir
  // kereliğine çağrılır. Opsiyonel.
  onLoad(client) {
    // Normal discord.js Client objesi
    client;
  },
  // Komut açıklaması, Gerekli.
  description: "Örnek komut.",
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
  },
  // Slash komut opsiyonları.
  // Daha fazla örnek için diğer komut dosylarına bakabilirsiniz.
  options: [],
  
})