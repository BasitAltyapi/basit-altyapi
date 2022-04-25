module.exports = new Underline.SlashCommand({
  name: ["modal","yolla"],
  description: "..",
  async onInteraction(inter, other) {
    let modal = Underline.interactions.get("doldur_beni").toJSON();
    inter.showModal(modal);
  },
  options: [],
  guildOnly: true
});