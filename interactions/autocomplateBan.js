module.exports = new Underline.SlashCommand({
  description: "Banlı bir kullanıcının banını açmanızı sağlar.",
  name: ["unban"],
  async onInteraction(inter, other) {
    let targetId = inter.options.getString("id", false)
    await inter.guild.bans.fetch({ cache: false });
    if (!inter.guild.bans.cache.has(targetId)) return inter.reply("Yasağını açacak kişiyi bulamadım!");
    await inter.deferReply();
    let user = inter.guild.bans.cache.get(targetId).user;
    await inter.guild.bans.remove(targetId);
    inter.editReply(`**${user.tag} (${user.id})** adlı kullanıcının yasağı açıldı!`);
  },
  options: [
    {
      name: "id",
      type: "STRING",
      description: "...",
      autocomplete: true,
      async onComplete(inter, value) {
        await inter.guild.bans.fetch({ cache: false });
        return [...inter.guild.bans.cache.values()].map(i => ({ name: i.user.tag, value: i.user.id }));
      },
      required: true
    }
  ],
  guildOnly: true,
  coolDown: 2000,
  perms: {
    bot: ["BAN_MEMBERS"],
    user: ["BAN_MEMBERS"]
  }
});