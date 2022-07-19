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
            placeholder: "Chate düşücek mesajı giriniz",
          }
        }
      ],
      [
        {
          type: "SelectMenu",
          data: {
            customId: "gender",
            minValues: 1,
            maxValues: 1,
            placeholder: "Cinsiyet seçiniz",
            options: [
              {
                label: "Erkek",
                value: "male"
              },
              {
                label: "Kadın",
                value: "female"
              }
            ]
          }
        }
      ]
    ]
  },
  guildOnly: true
});