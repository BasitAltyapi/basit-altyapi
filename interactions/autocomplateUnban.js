module.exports = new Underline.SlashCommand({
  description: "Banlı bir kullanıcının banını açmanızı sağlar.",
  name: ["unban"],
  async onInteraction(inter, other) {
    other.setCoolDown(30000, "channel")
    other.setCoolDown(10000, "guild")
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
      type: "String",
      description: "...",
      autocomplete: true,
      async onComplete(inter, value) {
        let bans = await inter.guild.bans.fetch({ cache: false });
        return [...bans.values()]
          .map(i => ({ name: i.user.tag, value: i.user.id }));
      },
      required: true
    }
  ],
  guildOnly: true,
  coolDown: [
    {
      type: "member",
      amount: 20000
    },
    {
      type: "guild",
      amount: 5000
    }
  ],
  perms: {
    bot: ["BAN_MEMBERS"],
    user: ["BAN_MEMBERS"]
  }
});