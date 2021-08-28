const conf = require("../configs/config.json");
const { crown } = require("../configs/emojis.json");

module.exports = new Underline.Event({
  eventName: "messageCreate",
  onEvent(message) {
    if (message.content.toLowerCase() === "tag" || message.content.toLowerCase() === "!tag" || message.content.toLowerCase() === ".tag") {
      await message.react(crown);
      message.channel.send(Underline.config.other.tag);
    }
  }
})