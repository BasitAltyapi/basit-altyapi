const { Util } = require("discord.js");
const util = require("util");
const stuffs = require("stuffs")
module.exports = new Underline.SlashCommand({
  name: ["interactions", "guild", "publish"],
  description: "Bot yetkilileri için publish komutu.",
  async onInteraction(inter, other) {
    await inter.deferReply();
    
    let guildID = inter.options.getString("guild");

    let guild = inter.client.guilds.cache.get(guildID);

    let type = inter.options.getString("publish_type") || "guildOnly"

    if (!guild) return inter.editReply("Malesef aradığınız sunucu bulunamadı...")

    let logged = await stuffs.execAsync(`node publishInteractions guild ${guildID} ${type}`);
    if(logged.stdout.includes("İnteraksiyonlar paylaşıldı!")) {
      await inter.editReply(other.locale.example.success());
    } else {

      inter.editReply(other.locale.example.error(guild.name))
      console.log("İnteraksyion paylaşma hatası")
      // console.log(logged.stdout);
      console.error(logged.stderr);

    }

  },
  coolDown: {
    type: "any",
    amount: 180000
  },
  perms: {
    user: ["DEVELOPER"]
  },
  options: [
    {
      name: "guild",
      type: "STRING",
      description: "Paylaşılacak sunucu sec",
      required: true,
      autocomplete: true,
      async onComplete(inter, value) {
        let guilds = await Underline.client.guilds.cache.map(g => ({name: g.name, value: g.id})).filter(x => !value || x.name.includes(value) || x.id === value);
        console.log(guilds)
        return guilds.slice(0, 24)
      }
    },
    {
      name: "publish_type",
      type: "STRING",
      description: "Paylaşılma tipi",
      required: false,
    }
  ],
  publishType: "guildOnly"
})