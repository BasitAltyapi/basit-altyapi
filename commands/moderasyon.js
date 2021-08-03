const {sleep} = require("stuffs");

module.exports = new (require("../types/Command"))({
  name: "moderasyon",
  async onCommand(interaction, other) {
    let action = interaction.options.getSubcommand();

    switch (action) {
      case "at": {
        let targetMember = interaction.options.getMember("uye");
        let reason = interaction.options.getString("sebep") || "";
        if (!targetMember.kickable) return interaction.reply("Bu üyeyi sunucudan atmaya gücüm yetmiyor.");
        
        await targetMember.kick(reason);
        
        interaction.reply(`**${targetMember.user.tag}** sunucudan **${reason ? reason : "Sebep belirtilmemiş."}** sebebi ile **atıldı**!`);

        break;
      };
      case "yasakla": {
        let targetMember = interaction.options.getMember("uye");
        let reason = interaction.options.getString("sebep") || "";
        if (!targetMember.bannable) return interaction.reply("Bu üyeyi sunucudan yasaklamaya gücüm yetmiyor.");

        await targetMember.ban({reason});

        interaction.reply(`**${targetMember.user.tag}** sunucudan **${reason ? reason : "Sebep belirtilmemiş."}** sebebi ile **yasaklandı**!`);

        break;
      };
      case "temizle": {
        let amount = interaction.options.getInteger("miktar");
        if (amount < 1 || amount > 100) return interaction.reply("Miktar 1 ila 100 arasında olmalıdır.");

        try {
          await interaction.channel.bulkDelete(amount);

          interaction.reply(`**${amount} adet** mesaj **silindi**.`);
          await sleep(3000);
          interaction.deleteReply();
        } catch (err) {
          interaction.reply(`Birşeyler yanlış gitti! \`${err}\``);
        }

        break;
      };
    }
  },
  guildOnly: true,
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