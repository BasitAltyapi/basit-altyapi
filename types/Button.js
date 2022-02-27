const { MessageButton } = require("discord.js");
const Interaction = require("./Interaction");
const stuffs = require("stuffs");

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
   * @param {Array<string | number | any>} data
   * @returns {MessageSelectMenu}
   */
  toJSON(data = []) {
    if (!Array.isArray(data)) throw Error(`SelectMenu#toJSON data type must be an array.`);
    data = data.map((key) => {
      if (typeof key === "string") return key;  
      if (typeof key === "number") return `π${key}`;
      let referenceId = stuffs.randomString(16);
      key.$unRef = () => {
        return Underline._references.delete(referenceId);
      }
      Underline._references.set(referenceId, key);
      return `¤${referenceId}`;
    });
    data.unshift(this.id);
    let customId = data.join("—");
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
