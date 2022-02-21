module.exports = new Underline.Button({
  id: "basBana",
  name: "basBana",
  nullError: true,
  // nullError: false,
  description: "...",
  onInteraction(inter, other) {
    inter.reply("Evet")
    inter.message.edit({
      components: [
        {
          type: "ACTION_ROW",
          components: [
            {
              ...this.toJSON(),
              label: `${Math.floor(1000 + Math.random() * 999)}`
            }
          ]
        }
      ]
    })
  },
  options: {
    style: "DANGER",
    label: "Rastgele Sayı!",
    emoji: "💥"
  },
  guildOnly: true,
  developerOnly: false
});