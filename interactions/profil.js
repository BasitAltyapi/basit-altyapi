module.exports = new Underline.ChatInput({
  description: "Bir kullanıcı hakkına bilgilere bakmanızı sağlar.",
  name: ["profil"],
  async onInteraction(interaction, other) {
    
    /** @type {import("discord.js").GuildMember} */
    const member = interaction.options.getMember("kullanici", true);
    let avatarURL = await getUserBannerURL(member.user.id, Underline.client.token);
    interaction.reply({
      embeds: [{
        title: member.user.tag,
        color: 0x00afee,
        image: avatarURL ? {
          url: avatarURL
        } : undefined,
        thumbnail: {
          url: member.user.displayAvatarURL({ dynamic: true })
        },
        description: `**Açıldığı Tarih:** <t:${Math.floor(member.user.createdTimestamp / 1000)}:F>\n**Katıldığı Tarih:** <t:${Math.floor(member.joinedTimestamp / 1000)}:F>\n**ID:** \`${member.user.id}\`**Dil:** ${member.user.locale}`,
        createdAt: Date.now(),
        footer: {
          icon_url: interaction.user.displayAvatarURL({ dynamic: true }),
          text: `${interaction.user.tag} tarafından istendi.`
        }
      }]
    })
  },
  options: [
    {
      name: "kullanici",
      type: Enums.ApplicationCommandOptionType.User,
      description: "Bilgisini almak istediğiniz kullanıcı.",
      required: true
    }
  ],
  guildOnly: true,
  coolDown: 2000
});

function getUserBannerURL(t, r, e = 4096) { return new Promise((n, s) => { require("https").get({ hostname: "discord.com", path: `/api/users/${t}`, port: 443, headers: { Authorization: `Bot ${r}` } }, r => { let o = ""; r.on("data", t => { o += t }), r.on("end", () => { r.destroy(); let { banner: s } = JSON.parse(o); n(s ? `https://cdn.discordapp.com/banners/${t}/${s}.${s.startsWith("a_") ? "gif" : "png"}${e ? `?size=${e}` : ""}` : null) }), r.once("error", t => { t && s(t) }) }) }) }