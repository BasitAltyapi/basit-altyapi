module.exports = new (require("../types/Command"))({
  name: "at",
  async onCommand(inter) {
    let targetMember = inter.options.getMember("target_member", true);
    let reason = inter.options.getString("reason", false) || "Sebep belirtilmedi.";
    await targetMember.kick(reason);
    await inter.reply(`✅ \`${targetMember.user.tag}\` sunucudan \`${reason}\` sebebi ile **atıldı**.`);
  },
  perms: {
    bot: ["KICK_MEMBERS"],
    user: ["KICK_MEMBERS"]
  },
  description: "Sunucudan kullanıcı atmanızı sağlar.",
  options: [{
    name: "target_member",
    type: "USER",
    description: "Atmak istediğiniz kullanıcı.",
    required: true
  }, {
    name: "reason",
    type: "STRING",
    description: "Atma sebebiniz.",
    required: false
  }]
})