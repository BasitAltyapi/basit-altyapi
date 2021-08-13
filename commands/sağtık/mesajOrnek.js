module.exports = new (require("../../types/Command"))({
  type: "COMMAND",
  // Aksiyon tipini "MESSAGE" yapmanız durumunda komut
  // İsminde büyük küçük ve türkçe harf kullanabilirsiniz.
  // Ve bu komut mesajlara sağ tıklandığında apps bölümünün
  // altında gözükür.
  actionType: "MESSAGE",
  name: "Sağtık Mesaj",
  onCommand(interaction, other) {
    // Sağtıklanan üyeyi almak için options.getMessage("message") diyorsunuz.
    let targetMessage = interaction.options.getMessage("message");

    interaction.reply(`**${interaction.user.tag}** adlı üye, **${targetMessage.author.tag}** adlı üyenin **${targetMessage.content}** mesajına sağ tıkladı.`)
  }
});