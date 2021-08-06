module.exports = new (require("../types/Command"))({
  type: "SUB_COMMAND",
  name: "deneme1",
  subName: "subcmd1",
  options: [],
  onCommand(interaction, other) {
    interaction.reply("Hello World!");
  }
})