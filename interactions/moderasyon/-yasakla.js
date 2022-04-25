module.exports = new Underline.SlashCommand({
  name: ["moderasyon", "yasakla"],
  description: "Sunucudan üye yasaklamanızı sağlar.",
  options: [
    {
      type: "User",
      name: "uye",
      description: "Yasaklanacak üye.",
      required: true
    },
    {
      type: "String",
      name: "sebep",
      description: "Yasaklanma sebebi",
      required: false
    }
  ],
  async onInteraction(interaction, other) {
    let targetMember = interaction.options.getMember("uye");
    let reason = interaction.options.getString("sebep") || "";
    if (!targetMember.bannable) return interaction.reply("Bu üyeyi sunucudan yasaklamaya gücüm yetmiyor.");

    await targetMember.ban({ reason });

    interaction.reply(`**${targetMember.user.tag}** sunucudan **${reason ? reason : "Sebep belirtilmemiş."}** sebebi ile **yasaklandı**!`);
  },
  perms: {
    bot: ["BAN_MEMBERS"],
    user: ["BAN_MEMBERS"]
  }
})