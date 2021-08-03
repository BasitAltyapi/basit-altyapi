module.exports = new (require("../types/Command"))({
  name: "matamatik",
  onCommand(interaction, other) {
    interaction.reply("test");
  },
  description: "Basit 4 işlem sorularını yapmanızı sağlar.",
  developerOnly: false,
  options: [
    {
      name: "number_one",
      type: "NUMBER",
      description: "Sayı Bir",
      required: true
    }, {
      name: "expression_type",
      type: "STRING",
      description: "İşlem tipi",
      required: true,
      choices: [
        {
          name: "Toplama (+)",
          value: "add"
        },
        {
          name: "Çıkarma (-)",
          value: "subtract"
        },
        {
          name: "Çarpma (*)",
          value: "multiply"
        },
        {
          name: "Bölme (/)",
          value: "divide"
        }
      ]
    }, {
      name: "number_two",
      type: "NUMBER",
      description: "Sayı İki",
      required: true
    },
  ],
  disabled: false
})