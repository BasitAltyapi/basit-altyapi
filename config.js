module.exports = new (require("./types/Config"))({
  prefixes: ["!", "ba!"],
  clientToken: "ODI0MjEwMTMyMzUwMDA5MzY2.YFsDgA.l6mAEBAdnKQuiM5hImDLCT9u5H4",
  // Kullanıcı idleri, kod içerisinden düzenlenebilir.
  blockedUsers: new Set([

  ]),
  // Kullanıcı idleri
  developers: new Set([
    "707309693449535599"
  ]),
  clientOptions: {},
  messages: {
    timeout(message, command, timeout) {
      message.reply(`Bu komutu tekrardan ${(timeout / 1000).toFixed(2)} saniye içerisinde kullanabilirsin.`);
    },
    disabled(message, command) {
      message.reply(`Bu komut kapatılmış.`)
    },
    blocked(message, command) {
      message.reply(`Bot kullanımından yasaklanmışsın.`)
      message.react("❌");
    },
    botPermsRequired(message, command, perms) {
      message.reply(`Bu komutun çalışması için ${perms.join(", ")} yetkilerine ihtiyacım var.`)
    },
    userPermsRequired(message, command, perms) {
      message.reply(`Bu komutu kullanabilmek için ${perms.join(", ")} yetkilerine ihtiyacın var.`)
    },
    developerOnly(message, command) {
      message.reply(`Bu komutu sadece bot geliştiricileri kullanabilir.`)
    },
    guildOnly(message, command) {
      message.reply(`Bu komut sadece sunucularda kullanılabilir.`);
    }
  },
  other: {},
  onBeforeLoad(client) {

  },
  onAfterLoad(client) {

  },
  onReady(client) {

  }
})