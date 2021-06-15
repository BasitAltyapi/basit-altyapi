module.exports = new (require("./types/Config"))({
  prefixes: ["!"],
  clientToken: "",
  messages: {
    timeout(message, command, timeout) {
      message.reply(`Bu komutu tekrardan ${(timeout / 1000).toFixed(2)} saniye içerisinde kullanabilirsin.`);
    },
    disabled(message, command) {
      message.reply(`Bu komut kapatılmış.`)
    },
    blocked(message, command) {
      message.reply(`Bot kullanımından yasaklanmışsın.`)
    },
    botPermsRequired(message, command, perms) {
      message.reply(`Bu komutun çalışması için ${perms.join(", ")} yetkilerine ihtiyacım var.`)
    },
    userPermsRequired(message, command, perms) {
      message.reply(`Bu komutu kullanabilmek için ${perms.join(", ")} yetkilerine ihtiyacın var.`)
    },
  }
})