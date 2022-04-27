module.exports = new Underline.ChatInput({
  name: ["moderasyon", "rol"],
  description: "Bir kullanıcıdan rol alamanızı sağlar.",
  options: [
    {
      type: "User",
      name: "uye",
      description: "Rol alacağanız kişi.",
      required: true
    },
    {
      type: "Role",
      name: "rol",
      description: "Alınacak rol.",
      required: true
    },
    {
      type: "String",
      name: "durum",
      description: "Rol verilsinmi alınsınmı?",
      required: true,
      choices: [
        {
          name: "Rol Ver",
          value: "true"
        },
        {
          name: "Rol Al",
          value: "false"
        }
      ]
    }
  ],
  async onInteraction(interaction, other) {
    /** @type {import("discord.js").GuildMember} */
    let targetMember = interaction.options.getMember("uye", true);
    let targetRole = interaction.options.getRole("rol", true);
    let stateString = interaction.options.getString("durum", true);
    let state = stateString == "true" ? true : false;

    try {
      if (state) {
        if (!targetMember.roles.cache.has(targetRole)) await targetMember.roles.add([targetRole]);
        interaction.reply(`**${targetMember.user.tag}** adlı üyeye **${targetRole.name}** rülü verildi.`);
      } else {
        if (targetMember.roles.cache.has(targetRole)) await targetMember.roles.remove([targetRole]);
        interaction.reply(`**${targetMember.user.tag}** adlı üyeden **${targetRole.name}** rülü alındı.`);
      }
    } catch (err) {
      interaction.reply(`**${targetMember.user.tag}** adlı üyenin rol durumu değiştirilken bir sorun ile karşılaşıldı. \`${err}\``);
    }
  },
  perms: {
    bot: ["ManageRoles"],
    user: ["ManageRoles"]
  }
})