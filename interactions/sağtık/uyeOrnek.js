module.exports = new Underline.UserAction({
  // İsminde büyük küçük ve türkçe harf kullanabilirsiniz.
  // Ve bu interaksiyon sunucu üylerine sağ tıklandığında apps
  // bölümünün altında gözükür.
  name: "Sağtık Üye",
  onInteraction(interaction, other) {
    // Sağtıklanan üyeyi almak için options.getUser("user") veya options.getMember("user") diyorsunuz.
    let targetUser = interaction.options.getUser("user");

    interaction.reply(`**${interaction.user.tag}** adlı üye, **${targetUser.tag}** adlı üyeye sağ tıkladı.`)
  }
});