module.exports = new Underline.Button({
  name: "ornek",
  description: "...",
  onInteraction(inter, other) {
    inter.reply("oka")
  },
  guildOnly: true,
  guildOwnerOnly: true,
  developerOnly: false,
  perms: {
    bot: ["CREATE_INSTANT_INVITE"],
    user: ["KICK_MEMBERS"]
  }
});