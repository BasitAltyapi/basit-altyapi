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
  /**
   * @param {Array<string | number>} data
   * @returns {MessageSelectMenu}
   */
  toJSON(data = []) {
    if (!Array.isArray(data)) throw Error(`SelectMenu#toJSON data type must be an array.`);
    data = data.map((key) => {
      if (typeof key != "string" && typeof key != "number") throw Error(`SelectMenu#toJSON data type must be an array of strings or numbers.`);  
      if (typeof key === "number") return `©${key}`;
      return key;
    });
    data.unshift(this.id);
    let customId = data.join("§");
    if (customId.length > 100) throw Error(`SelectMenu#toJSON id and data length must be less than 100.`);
    let menu = new MessageSelectMenu()
      .addOptions(this.options?.choices ?? [])
      .setMinValues(this.options.min ?? 1)
      .setMaxValues(this.options.max ?? this.options.choices.length)
      .setCustomId(customId);
    if(this.options.placeholder) menu.setPlaceholder(this.options.placeholder)
    return menu;
  }
}

module.exports = SelectMenu;

