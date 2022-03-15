module.exports = new Underline.Event({
  eventName: "mongooseDatabase:onConnect",
  async onEvent(connected) {
    console.log(`[DATABASE] ${ connected ? "Bağlandı": "Bağlanamadı" }!`);
  }
})