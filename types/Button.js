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
  toJSON() {
    let button = new MessageButton()
      .setCustomId(this.id)
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
