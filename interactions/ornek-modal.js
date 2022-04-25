module.exports = new Underline.Modal({
  id: "doldur_beni",
  name: "doldur_beni",
  description: "...",
  async onInteraction(inter, other) {
    let firstRow = inter.components[0];
    let firstInput = firstRow.components.find(x => x.customId == "test").value;
    inter.reply({
      content: firstInput
    })
  },
  options: {
    title: "Test-123",
    rows: [
      [
        {
          type: "TextInput",
          data: {
            customId: "test",
            label: "Mesajınız",
            style: 2,
            type: 4,
            placeholder: "Chate düşücek mesajı giriniz",
          }
        }
      ]
    ]
  },
  guildOnly: true
});