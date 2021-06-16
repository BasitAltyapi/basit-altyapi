const { MessageEmbed } = require("discord.js")

module.exports = new (require("../types/Command"))({
  aliases: ["at"],
  async onCommand(msg, { args, usedPrefix, usedAlias }) {
    const embed = new MessageEmbed();
    embed.setAuthor(global.client.user.tag, global.client.user.avatarURL());
    embed.setTitle("Komut Listesi");
    embed.setDescription(`Bu bot toplamda ${global.commands.size} komut ve ${global.events.size} olay içeriyor. Desteklenen ön-ek'ler ${global.config.prefixes.map(i=>`\`${i}\``).join(", ")}.`);
    global.commands.forEach((command) => {
      let desc = `> ${command.desc ? command.desc : "*Açıklama koyulmamış.*"}\n${command.developerOnly ? "\n> - Geliştiricilere Özel." : ""}${command.coolDown > 0 ? `\n> - ${(command.coolDown/1000).toFixed(1)} Saniye yavaşlatma.` : ""}\n** **`.trim();
      embed.addField(`• ${command.aliases.join(", ")}`, desc);
    });
    embed.setFooter(`Armağanın Basit Altyapısı`);
    embed.setTimestamp();
    embed.setColor("#62CFF7");
    msg.channel.send(embed);
  },
  coolDown: 2000
})