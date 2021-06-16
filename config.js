module.exports = new (require("./types/Config"))({
  prefixes: ["!", "ba!"],
  clientToken: "",
  blockedUsers: new Set([

  ]),
  developers: new Set([
    "707309693449535599"
  ]),
  clientOptions: {},
  messages: {
    timeout(message, command, timeout) {
      message.reply(`Bu komutu tekrardan ${(timeout / 1000).toFixed(2)} saniye içerisinde kullanabilirsin.`).then(m=>m.delete({timeout: 5000}));
      message.react("⏳");
      if (message.deletable) message.delete({ timeout: 5000 });
    },
    disabled(message, command) {
      message.react("⭕");
    },
    blocked(message, command) {
      message.react("💥");
    },
    botPermsRequired(message, command, perms) {
      message.reply(`Bu komutun çalışması için ${perms.join(", ")} yetkilerine ihtiyacım var.`).then(m => m.delete({ timeout: 5000 }));
    },
    userPermsRequired(message, command, perms) {
      message.reply(`Bu komutu kullanabilmek için ${perms.join(", ")} yetkilerine ihtiyacın var.`).then(m => m.delete({ timeout: 5000 }));
    },
    developerOnly(message, command) {
      message.reply(`Bu komutu sadece bot geliştiricileri kullanabilir.`).then(m => m.delete({ timeout: 5000 }));
    },
    guildOnly(message, command) {
      message.reply(`Bu komut sadece sunucularda kullanılabilir.`).then(m => m.delete({ timeout: 5000 }));
    }
  },
  other: {},
  onBeforeLoad(client) {
    console.log("[CONFIG] Yüklemeye başlamadan önce çalıştı.");
  },
  onAfterLoad(client) {
    console.log("[CONFIG] Yükleme bittikten sonra çalıştı.");
  },
  onReady(client) {
    console.log("[CONFIG] Discord hesabına giriş yaptıktan sonra çalıştı.");
  }
})