module.exports = new Underline.SlashCommand({
  name: ["moderasyon", "ses-sustur"],
  description: "Bir kullanıcının ses susturmasını açıp kapamanızı sağlar.",
  options: [
    {
      type: "USER",
      name: "uye",
      description: "Rol verceğeniz kişi.",
      required: true
    },
    {
      type: "STRING",
      name: "durum",
      description: "Susturulma durumu.",
      required: true,
      choices: [
        {
          name: "Sustur (Mute)",
          value: "true"
        },
        {
          name: "Susturma Aç (Unmute)",
          value: "false"
        }
      ]
    }
  ],
  async onInteraction(interaction, other) {
    /** @type {import("discord.js").GuildMember} */
    let targetMember = interaction.options.getMember("uye", true);
    let stateString = interaction.options.getString("durum", true);
    let state = stateString == "true" ? true : false;
    
    try {
      await targetMember.voice.setMute(state);
      if (state) {
        interaction.reply(`**${targetMember.user.tag}** adlı üye sesli kanallarda **susturuldu**.`);
      } else {
        interaction.reply(`**${targetMember.user.tag}** adlı üyenin ses kanallarında **susuturması açıldı**.`);
      }
    } catch (err) {
      interaction.reply(`**${targetMember.user.tag}** adlı üyenin susuturma durumu değiştirelemedi. \`${err}\``);
    }

  },
  perms: {
    bot: ["MANAGE_CHANNELS"],
    user: ["MANAGE_CHANNELS"]
  }
})