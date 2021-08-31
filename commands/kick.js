module.exports = new Underline.Command({
  aliases: [],
  async onCommand(msg, { args, usedPrefix, usedAlias }) {
    let targetMember = msg.mentions.members.first() || (isNaN(args[1]) ? null : await msg.guild.members.cache.get(args[1]));
    if (!targetMember) {
      return msg.reply("Komut kullanımı: `" + `${usedPrefix}${usedAlias} <etiket/id> [sebep]` + "`. Id kullandığınızda çalışmıyorsa etiketlemeyi deneyin.");
    }
    let reason = args.slice(2).join(" ").trim() || "Sebep belirtilmedi.";
    let message = await msg.channel.send(`⏳ \`${targetMember.user.tag}\` sunucudan \`${reason}\` sebebi ile **atılıyor**..`);
    await targetMember.kick(reason);
    await message.edit(`✅ \`${targetMember.user.tag}\` sunucudan \`${reason}\` sebebi ile **atıldı**.`);
  },
  coolDown: 1000,
  perms: {
    bot: ["KICK_MEMBERS"],
    user: ["KICK_MEMBERS"]
  },
  desc: "Sunucudan kullanıcı atmanızı sağlar.",
  other: {
    usage: "{p}{alias} <etiket/id> [sebep]"
  }
})