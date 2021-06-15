class Event {
  
  /** @type {string} */
  name = "";

  /** @type {keyof import("discord.js").ClientEvents} */
  eventName = "";

  /**
   * @param  {...any} args 
   */
  onEvent(...args) {
    
  }

  /**
   * @param {import("discord.js").Client} client 
   */
  onLoad(client) {

  }

  disabled = false;

  /**
   * @param {Event} arg
   */
  constructor(arg) {
    this.name = arg.name;
    this.eventName = arg.eventName;
    this.onEvent = arg.onEvent;
    if (typeof arg.onLoad == "function") this.onLoad = arg.onLoad;
    this.disabled = Boolean(arg.disabled);
  }
}

module.exports = Event;