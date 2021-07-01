module.exports = new (require("../types/Event"))({
  onEvent(message) {
    // Olay olduğunda burası çalışır.
  },
  onLoad(client) {
    // Olay çalışmaya hazır olduğunda burası çalışır. Opsiyonel silebilrisiniz.
  },
  name: "deneme",
  eventName: "message",
  disabled: false
});
