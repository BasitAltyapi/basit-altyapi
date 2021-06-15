const { MessageEmbed } = require("discord.js");

module.exports = new (require("../types/Command"))({
  aliases: ["help", "yardım"],
  onCommand(message, { setCooldown, plsargs }) {
    setCooldown(1000);

    let embed = new MessageEmbed();
    embed.setTitle(`${global.commands.size} komut`);
    global.commands.forEach((command) => {
      embed.addField(`> ${command.name}`, `> Kısayollar: ${command.aliases.join(", ")}\n> Açıklama: ${command.desc}`, true);
    });
    embed.setColor("RANDOM");
    embed.setFooter("Basit altyapı, Kıraç Armağan Önal tarafından.", message.client.user.avatarURL());
    message.channel.send(embed);
  },
  desc: "Yardım menüsünü gösterir."
})