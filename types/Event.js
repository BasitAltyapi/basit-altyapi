class Event {

  /** @private */
  _type = "event";
  
  /** @type {string} */
  id = "";

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
   * @param {Omit<Event, "_type">} arg
   */
  constructor(arg) {
    this.id = arg.id;
    this.eventName = arg.eventName;
    this.onEvent = arg.onEvent;
    if (typeof arg.onLoad == "function") this.onLoad = arg.onLoad;
    this.disabled = Boolean(arg.disabled);
  }
}

module.exports = Event;