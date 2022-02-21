module.exports = new Underline.SelectMenu({
  id: "secBeni",
  name: "secBeni",
  nullError: false,
  description: "...",
  onInteraction(inter, other) {
    inter.reply({
      content: inter.values[0] || "yok bişi seç.",
      ephemeral: true
    })
  },
  options: {
    get choices() {
      return Array(25).fill("").map((_, i) => ({ label: Math.random().toString(), value: `${i}`}))
    }
  },
  guildOnly: false,
  developerOnly: false
});