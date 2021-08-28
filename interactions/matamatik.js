const expressionMap = {
  "add": "+",
  "subtract": "-",
  "multiply": "*",
  "divide": "/"
};

module.exports = new Underline.Interaction({
  type: "COMMAND",
  name: "matamatik",
  onInteraction(interaction, other) {
    let numberOne = interaction.options.getNumber("number_one");
    let expressionName = interaction.options.getString("expression_type");
    let numberTwo = interaction.options.getNumber("number_two");

    let expressionOperator = expressionMap[expressionName];
    let result = eval(`${numberOne}${expressionOperator}${numberTwo}`);

    interaction.reply(`\`${numberOne} ${expressionOperator} ${numberTwo}\` işleminin cevabı: \`${result}\``);
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