const { MessageButton, MessageActionRow, MessageSelectMenu } = require("discord.js");

module.exports = new Underline.SlashCommand({
  name: ["buton-yolla"],
  description: "Buton yollar",
  async onInteraction(inter, other) {
    let button = new MessageButton().setLabel("hi").setStyle("PRIMARY").setCustomId("ornek");
    let menu = new MessageSelectMenu().setCustomId("ornek").setMinValues(1).setMaxValues(1).setOptions([
      {
        label: "hi",
        value: "sa"
      },
      {
        label: "hello",
        value: "as"
      },
    ])
    let row = new MessageActionRow().addComponents(button)
    let row2 = new MessageActionRow().addComponents(menu)
    inter.reply({
      content: "Kebabu",
      components: [
        row
      ]
    })
    if(!inter.channel) await inter.user.createDM();
    inter.channel.send({
      content: "bö",
      components: [
        row2
      ]
    })
  },
  guildOnly: false,
  developerOnly: false
});