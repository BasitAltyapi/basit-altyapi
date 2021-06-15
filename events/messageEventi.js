module.exports = new (require("../types/Event"))({
  eventName: "message",
  /**
   * @param {import("discord.js").Message} message 
   */
  onEvent(message) {
    console.log(`[MESAJ] ${message.author.tag}: ${message.content}`);
  }
});