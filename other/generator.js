const { prompt, AutoComplete, Toggle } = require("enquirer");
const chillout = require("chillout");
const fs = require("fs");
const path = require("path");
let mode = process.argv[2];
require("./patchConsoleLog");

if (!["event", "command"].includes(mode)) {
  console.error("Geçersiz mod. Modlar: event, command");
  process.exit(-1);
}

(async () => {
  if (mode == "command") {
    console.error("Komut oluşturma henüz eklenmedi.");
  } else if (mode == "event") {
    let { name } = await prompt({
      type: "input",
      name: "name",
      message: "Olay dosya ismi ne olsun?",
      validate(name) {
        if (name.endsWith(".js")) name = name.slice(-3);
        return !fs.existsSync(path.resolve("./events", `${name}.js`));
      },
      required: true
    });
    let eventName = await (new AutoComplete({
      required: true,
      message: "Discord.js üzerinde hangi olayı dinleyeceksin?",
      name: "eventName",
      limit: 6,
      index: 0,
      choices: ["channelCreate", "channelDelete", "channelPinsUpdate", "channelUpdate", "debug", "warn", "disconnect", "emojiCreate", "emojiDelete", "emojiUpdate", "error", "guildBanAdd", "guildBanRemove", "guildCreate", "guildDelete", "guildUnavailable", "guildIntegrationsUpdate", "guildMemberAdd", "guildMemberAvailable", "guildMemberRemove", "guildMembersChunk", "guildMemberSpeaking", "guildMemberUpdate", "guildUpdate", "inviteCreate", "inviteDelete", "message", "messageDelete", "messageReactionRemoveAll", "messageReactionRemoveEmoji", "messageDeleteBulk", "messageReactionAdd", "messageReactionRemove", "messageUpdate", "presenceUpdate", "rateLimit", "ready", "invalidated", "roleCreate", "roleDelete", "roleUpdate", "typingStart", "userUpdate", "voiceStateUpdate", "webhookUpdate", "shardDisconnect", "shardError", "shardReady", "shardReconnecting", "shardResume"]
    })).run();

    const disabled = await (new Toggle({
      message: "Olay varsayılan olarak kapalı olsun mu?",
      enabled: "Olsun",
      disabled: "Olmasın"
    })).run();

    name = name.replace(/ +/g, "");
    if (name.endsWith(".js")) name = name.slice(-3);
    let filePath = path.resolve("./events", `${name}.js`);

    console.log(`√ Dosya "${filePath}" konumuna hazırlanıyor!`);
    await fs.promises.writeFile(filePath, `module.exports = new (require("../types/Event"))({
  onEvent(message) {
    // Olay olduğunda burası çalışır.
  },
  onLoad(client) {
    // Olay çalışmaya hazır olduğunda burası çalışır. Opsiyonel silebilrisiniz.
  },
  name: "${name}",
  eventName: "${eventName}",
  disabled: ${disabled}
});
`);
    console.log("√ Hazır!");
  }
})();