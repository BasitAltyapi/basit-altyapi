const { Util, ApplicationCommandOptionType } = require("discord.js");
const util = require("util");

module.exports = new Underline.ChatInput({
  name: ["eval"],
  description: "Bot yetkilileri için JavaScript çalıştırma komutu.",
  async onInteraction(interaction) {
    let codeString = interaction.options.getString("code", true);
    await interaction.deferReply();
    let result;
    try {
      result = await eval(codeString);
    } catch (err) {
      result = err;
    }
    result = Util.splitMessage(`\`\`\`${util.inspect(result, 0, 3, 0).replaceAll(interaction.client.token, "<kendini çok zeki sandın herhalde>")}\`\`\``, { append: "```", prepend: "```" });
    for (let index = 0; index < result.length; index++) {
      const part = result[index];
      if (index == 0) {
        await interaction.editReply({
          ephemeral: true,
          content: part
        })
      } else {
        await interaction.followUp({
          ephemeral: true,
          content: part
        })
      }
    }
  },
  perms: {
    user: ["Developer"],
  },
  options: [
    {
      description: "JavaScript kodu.",
      name: "code",
      type: ApplicationCommandOptionType.String,
      required: true
    }
  ]
})