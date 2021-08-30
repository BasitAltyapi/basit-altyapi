module.exports = new Underline.SlashSubCommand({
  name: "moderasyon",
  subName: "at",
  description: "Sunucudan üye atmanızı sağlar.",
  options: [
    {
      type: "USER",
      name: "uye",
      description: "Atılacak üye.",
      required: true
    },
    {
      type: "STRING",
      name: "sebep",
      description: "Atılma sebebi",
      required: false
    }
  ],
  async onInteraction(interaction, other) {
    let targetMember = interaction.options.getMember("uye");
    let reason = interaction.options.getString("sebep") || "";
    if (!targetMember.kickable) return interaction.reply("Bu üyeyi sunucudan atmaya gücüm yetmiyor.");

    await targetMember.kick(reason);

    interaction.reply(`**${targetMember.user.tag}** sunucudan **${reason ? reason : "Sebep belirtilmemiş."}** sebebi ile **atıldı**!`);
  },
  perms: {
    bot: ["BAN_MEMBERS"],
    user: ["BAN_MEMBERS"]
  }
})