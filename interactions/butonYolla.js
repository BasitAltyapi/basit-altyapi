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
            Underline.interactions.get("basBana").toJSON()
          ]
        }
      ]
    })
  },
  guildOnly: false,
  developerOnly: false
});