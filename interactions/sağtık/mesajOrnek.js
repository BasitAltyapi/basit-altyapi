module.exports = new Underline.MessageAction({
  // İsminde büyük küçük ve türkçe harf kullanabilirsiniz.
  // Ve bu interaksiyon sunucu mesajlarına sağ tıklandığında apps
  // bölümünün altında gözükür.
  name: "Sağtık Mesaj",
  onInteraction(interaction, other) {
    // Sağtıklanan üyeyi almak için options.getMessage("message") diyorsunuz.
    let targetMessage = interaction.options.getMessage("message");

    interaction.reply(`**${interaction.user.tag}** adlı üye, **${targetMessage.author.tag}** adlı üyenin **${targetMessage.content}** mesajına sağ tıkladı.`)
  }
});

