module.exports = new Underline.Button({
  name: "ornek",
  id: "ornek",
  description: "...",
  onInteraction(inter, other) {

    inter.reply(`düğme sahibi ${other.data[0]}`)
  },
  perms: {
    bot: ["CREATE_INSTANT_INVITE"],
    user: ["KICK_MEMBERS", "GUILD_OWNER"]
  },
  options: {
    style: "PRIMARY",
    label: "sa"
  }
});