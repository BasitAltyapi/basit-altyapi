module.exports = new (require("../../types/Command"))({
  type: "COMMAND",
  // Aksiyon tipini "USER" yapmanız durumunda komut
  // İsminde büyük küçük ve türkçe harf kullanabilirsiniz.
  // Ve bu komut sunucu üylerine sağ tıklandığında apps
  // bölümünün altında gözükür.
  actionType: "USER",
  name: "Sağtık Üye",
  onCommand(interaction, other) {
    // Sağtıklanan üyeyi almak için options.getUser("user") veya options.getMember("user") diyorsunuz.
    let targetUser = interaction.options.getUser("user");

    interaction.reply(`**${interaction.user.tag}** adlı üye, **${targetUser.tag}** adlı üyeye sağ tıkladı.`)
  }
});