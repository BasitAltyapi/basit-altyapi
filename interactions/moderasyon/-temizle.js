const sleep = require('stuffs/lib/sleep');

module.exports = new Underline.SlashCommand({
  name: ["moderasyon", "temizle"],
  description: "Belli bir miktar mesaj silemenizi sağlar.",
  options: [
    {
      type: "Integer",
      name: "miktar",
      description: "Silinecek mesaj miktarı. Maximum 100.",
      required: true
    }
  ],
  async onInteraction(interaction, other) {
    let amount = interaction.options.getInteger("miktar");
    if (amount < 1 || amount > 100) return interaction.reply("Miktar 1 ila 100 arasında olmalıdır.");

    try {
      await interaction.channel.bulkDelete(amount);

      interaction.reply(`**${amount} adet** mesaj **silindi**.`);
      await sleep(3000);
      interaction.deleteReply();
    } catch (err) {
      interaction.channel.send(`Birşeyler yanlış gitti! \`${err}\``);
    }
  },
  perms: {
    bot: ["MANAGE_MESSAGES"],
    user: ["MANAGE_MESSAGES"]
  }
})