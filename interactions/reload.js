module.exports = new Underline.SlashCommand({
  name: ["reload"],
  description: "Bot yetkilileri için Underline reload komutu.",
  async onInteraction(interaction) {
    await interaction.deferReply();
    await Underline.reload();
    await interaction.editReply("✔ Yeniden yükleme işlemi başarılı.");
  },
  coolDown: {
    type: "any",
    amount: 180000
  },
  perms: {
    user: ["DEVELOPER"]
  },
  publishType: "guildOnly"
})