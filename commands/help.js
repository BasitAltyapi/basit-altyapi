const { MessageEmbed } = require("discord.js")

module.exports = new Underline.Command({
  aliases: ["at"],
  async onCommand(msg, { args, usedPrefix, usedAlias }) {
    const embed = new MessageEmbed();
    embed.setAuthor(Underline.client.user.tag, Underline.client.user.avatarURL());
    embed.setTitle("Komut Listesi");
    embed.setDescription(`Bu bot toplamda ${Underline.commands.size} komut ve ${Underline.events.size} olay içeriyor. Desteklenen ön-ek'ler ${Underline.config.prefixes.map(i=>`\`${i}\``).join(", ")}.`);
    Underline.commands.forEach((command) => {
      let desc = `> ${command.desc ? command.desc : "*Açıklama koyulmamış.*"}\n${command.developerOnly ? "\n> - Geliştiricilere Özel." : ""}${command.coolDown > 0 ? `\n> - ${(command.coolDown/1000).toFixed(1)} Saniye yavaşlatma.` : ""}\n** **`.trim();
      embed.addField(`• ${command.aliases.join(", ")}`, desc);
    });
    embed.setFooter(`Armağanın Basit Altyapısı`);
    embed.setTimestamp();
    embed.setColor("#62CFF7");
    msg.channel.send(embed);
  },
  coolDown: 2000,
  guildOnly: false
})