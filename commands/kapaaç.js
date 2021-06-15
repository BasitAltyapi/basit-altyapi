module.exports = new (require("../types/Command"))({
  aliases: ["açkapa"],
  onCommand(message, { plsargs, usedAlias, usedPrefix }) {
    if (!plsargs.has(1)) return message.reply(`kullanımı: ${usedPrefix}${usedAlias} komutİsmi`);

    let komutİsmi = plsargs.get(1);

    if (komutİsmi == "kapaaç") return message.reply("kapayıp açma komutunu kapatıp açamazsın.");

    let komut = global.commands.get(komutİsmi);

    if (!komut) return message.reply("komut bulunamadı.");

    komut.disabled = !komut.disabled;

    message.reply(komut.disabled ? "komut kapandı" : "komut açıldı");
  },
  desc: "komut aç kapa artema ha ha",
  developerOnly: true,
})