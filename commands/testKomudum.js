module.exports = new (require("../types/Command"))({
  aliases: ["test"],
  onCommand(message, { setCooldown, plsargs }) {
    if (plsargs.has("reset")) {
      message.reply("Tamamdır! Cooldown sıfırladım");
      setCooldown(0);
    } else {
      message.reply("Tamamdır! 50 saniye cooldown koyuyorum.");
      setCooldown(50000);
    }
  },
  desc: "Test komutu her türlü şey olabilir."
})