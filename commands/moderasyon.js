module.exports = new (require("../types/Command"))({
  name: "moderasyon",
  onCommand(interaction, other) {
    let action = interaction.options.getSubcommand();

    switch (action) {
      case "at": {
        let targetMember = interaction.options.getMember("uye");
        let reason = interaction.options.getString("reason");

        
        break;
      };
      case "yasakla": {
        let targetMember = interaction.options.getMember("uye");
        let reason = interaction.options.getString("reason");

        break;
      };
      case "temizle": {
        let amount = interaction.options.getInteger("miktar");
        

        break;
      };
    }
  },
  description: "Basit moderasyon komutları burada.",
  options: [
    {
      name: "at",
      description: "Sunucudan üye atmanızı sağlar.",
      type: "SUB_COMMAND",
      options: [
        {
          type: "USER",
          name: "uye",
          description: "Yasaklanacak üye.",
          required: true
        },
        {
          type: "STRING",
          name: "sebep",
          description: "Atılma sebebi",
          required: false
        }
      ]
    },
    {
      name: "yasakla",
      description: "Sunucudan üye yasaklamanızı sağlar.",
      type: "SUB_COMMAND",
      options: [
        {
          type: "USER",
          name: "uye",
          description: "Yasaklanacak üye.",
          required: true
        },
        {
          type: "STRING",
          name: "sebep",
          description: "Atılma sebebi",
          required: false
        }
      ]
    },
    {
      name: "temizle",
      description: "Mesaj temizlemenizi sağlar.",
      type: "SUB_COMMAND",
      options: [
        {
          type: "INTEGER",
          name: "miktar",
          description: "Silinecek mesaj miktarı. Maximum 100.",
          required: true
        }
      ]
    }
  ],
})