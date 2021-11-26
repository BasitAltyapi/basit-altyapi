module.exports = new Underline.SlashCommand({
  name: ["buton-yolla"],
  description: "Buton yollar",
  async onInteraction(inter, other) {
    inter.reply({
      content: "Düğme!",
      components: [
        {
          type: "ACTION_ROW",
          components: [
            Underline.interactions.get("ornek").toJSON()
          ]
        }
      ]
    })
  },
  coolDown: {
    amount: 10000,
    type: "user"
  },
  guildOnly: false,
  developerOnly: false
});