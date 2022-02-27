const { MessageSelectMenu } = require("discord.js");
const Interaction = require("./Interaction");
const stuffs = require("stuffs");

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

