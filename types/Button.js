const { MessageButton } = require("discord.js");
const Interaction = require("./Interaction");

class Button extends Interaction {
  /** @param {Interaction.TOmittedInteraction & Interaction.Button} arg */
  constructor (arg = { }) {
    super({
      _type: "noDeployInteraction",
      actionType: "BUTTON",
      ...arg
    })
  }
  isButton() { return true; }
  /**
   * @param {Array<string | number>} data
   * @returns {MessageSelectMenu}
   */
  toJSON(data = []) {
    if (!Array.isArray(data)) throw Error(`SelectMenu#toJSON data type must be an array.`);
    data = data.map((key) => {
      if (typeof key !== "string" && typeof key !== "number") throw Error(`SelectMenu#toJSON data type must be an array of strings or numbers.`);  
      if (typeof key === "number") return `©${key}`;
      return key;
    });
    data.unshift(this.id);
    let customId = data.join("§");
    if (customId.length > 100) throw Error(`SelectMenu#toJSON id and data length must be less than 100.`);
    let button = new MessageButton()
      .setCustomId(customId)
      .setStyle(this.options.style);
    if (this.options.emoji) button.setEmoji(this.options.emoji);
    if (this.options.label) button.setLabel(this.options.label);
    if (this.options.url) button.setURL(this.options.url);
    return button;
  }
  isSelectMenu() { return false; }
  isChatActionCommand() { return false; }
  isUserActionCommand() { return false; }
  isMessageActionCommand() { return false; }
}

module.exports = Button;
