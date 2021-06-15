module.exports = new (require("../types/Command"))({
  onCommand(message, { setCooldown, plsargs }) {
    message.reply("woooo")
  },
  desc: "kick mik işte",
  perms: {
    bot: ["KICK_MEMBERS"],
    user: ["KICK_MEMBERS"]
  }
})