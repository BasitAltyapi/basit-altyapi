const { MessageEmbed } = require("discord.js")

module.exports = new (require("../types/Command"))({
  aliases: ["kullanımı"],
  async onCommand(msg, { args, usedPrefix, usedAlias }) {
    let komut = global.commands.find(cmd => cmd.aliases.some(a => a.toLowerCase() == (args[1]?.toLowerCase() || "usage")));
    if (!komut) return msg.reply("Kullanımını öğrenmek istediğin komutu bulamadım.");
    
    if (!komut.other?.usage) return msg.reply("Bakmak istediğin komutun bir kullımı belirlenmemiş.");

    let usageText = komut.other.usage.replace("{p}", usedPrefix).replace("{alias}", komut.aliases[0]);
    
    let embed = new MessageEmbed();
    embed.setAuthor(global.client.user.tag, global.client.user.avatarURL());
    embed.setTitle(`${args[1] || komut.aliases[0]} adlı komutun kullanımı`)
    embed.setColor("RANDOM");
    embed.addField("Açıklama", komut.desc || "Açıklama belirtilmemiş.");
    embed.addField("Kullanımı", usageText);
    embed.addField("Yavaşlatma", `${komut.coolDown <= 0 ? "Yok" : `${(komut.coolDown / 1000).toFixed(2)} saniye yavaşlatma`}`)
    embed.addField("Sadece Geliştriciler?", komut.developerOnly ? "Evet" : "Hayır");
    embed.addField("Sadece Sunucular?", komut.guildOnly ? "Evet" : "Hayır")
    embed.setFooter(`${msg.author.tag} tarafından istendi. - Basit Altyapı`, msg.author.avatarURL());
    msg.channel.send(embed);
  },
  other: {
    usage: "{p}{alias} [komut-ismi]"
  },
  desc: "Komutların nasıl kullanıldığına bakmanızı sağlar.",
  coolDown: 1000,
  guildOnly: false
})