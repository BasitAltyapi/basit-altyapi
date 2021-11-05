const { Util } = require("discord.js");
const util = require("util");

module.exports = new Underline.SlashCommand({
  name: ["reload"],
  description: "Bot yetkilileri için Underline reload komutu.",
  developerOnly: true,
  async onInteraction(interaction) {
    await interaction.deferReply();
    await Underline.reload();
    await interaction.editReply("✔ Yeniden yükleme işlemi başarılı.");
  }
})