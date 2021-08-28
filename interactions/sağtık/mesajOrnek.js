module.exports = new Underline.Interaction({
  type: "COMMAND",
  // Aksiyon tipini "MESSAGE" yapmanız durumunda interaksiyon
  // İsminde büyük küçük ve türkçe harf kullanabilirsiniz.
  // Ve bu interaksiyon mesajlara sağ tıklandığında apps bölümünün
  // altında gözükür.
  actionType: "MESSAGE",
  name: "Sağtık Mesaj",
  onInteraction(interaction, other) {
    // Sağtıklanan üyeyi almak için options.getMessage("message") diyorsunuz.
    let targetMessage = interaction.options.getMessage("message");

    interaction.reply(`**${interaction.user.tag}** adlı üye, **${targetMessage.author.tag}** adlı üyenin **${targetMessage.content}** mesajına sağ tıkladı.`)
  }
});

