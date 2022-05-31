module.exports = new Underline.ChatInput({
  name: ["buton-yolla"],
  description: "Buton yollar",
  async onInteraction(inter, other) {
    inter.reply({
      content: "Düğme!",
      components: [
        {
          type: Enums.ComponentType.ActionRow,
          components: [
            Underline.interactions.get("ornek").toJSON([inter.user])
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