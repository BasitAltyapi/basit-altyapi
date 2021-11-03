const { MessageSelectMenu } = require("discord.js");
const Interaction = require("./Interaction");

class SelectMenu extends Interaction {
  /** @param {Interaction.TOmittedInteraction & Interaction.SelectMenu} arg */
  constructor (arg = {}) {
    super({
      _type: "noDeployInteraction",
      actionType: "SELECT_MENU",
      ...arg
    })
  }
  isSelectMenu() { return true; }
  isButton() { return false; }
  isChatActionCommand() { return false; }
  isUserActionCommand() { return false; }
  isMessageActionCommand() { return false; }
  toJSON() {
    let menu = new MessageSelectMenu()
      .addOptions(this.options?.choices ?? [])
      .setMinValues(this.options.min ?? 1)
      .setMaxValues(this.options.max ?? this.options.choices.length)
      .setCustomId(this.id);
    if(this.options.placeholder) menu.setPlaceholder(this.options.placeholder)
    return menu;
  }
}

module.exports = SelectMenu;

