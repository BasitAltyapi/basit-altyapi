const { ModalBuilder, ActionRowBuilder, TextInputBuilder, SelectMenuBuilder } = require("discord.js");
const Interaction = require("./Interaction");
const stuffs = require("stuffs");

class Modal extends Interaction {
  /** @param {Interaction.TOmittedInteraction & Interaction.Modal} arg */
  constructor(arg = {}) {
    super({
      _type: "ComponentInteraction",
      actionType: "Modal",
      ...arg
    })
  }
  isModal() { return true; }
  isButton() { return false; }
  /**
   * @param {Array<string | number | any>} data
   * @returns {ModalBuilder}
   */
  toJSON(data = []) {
    if (!Array.isArray(data)) throw Error(`Modal#toJSON data type must be an array.`);
    data = data.map((key) => {
      if (typeof key === "string") return key;
      if (typeof key === "number") return `π${key}`;
      let referenceId = stuffs.randomString(16);
      if (key.$key) return key.$key;
      key.$key = `¤${referenceId}`;
      key.$unRef = () => {
        return Underline._references.delete(referenceId);
      }
      Underline._references.set(referenceId, key);
      return key.$key;
    });
    data.unshift(this.id);
    let customId = data.join("—");
    if (customId.length > 100) throw Error(`Modal#toJSON id and data length must be less than 100.`);
    let modal = new ModalBuilder()
      .setCustomId(customId)
      .setTitle(this.options.title || this.id.slice(0, 32))

    let rows = [];

    for (let i = 0; i < this.options.rows.length; i++) {
      let components = [];
      /** @type {{type: "TextInput", data: TextInputComponentData}[]} */
      let rawComponents = this.options.rows[i];

      for (let j = 0; j < rawComponents.length; j++) {
        let uComponent = rawComponents[j];
        switch (uComponent.type) {
          case "TextInput": {
            let input = new TextInputBuilder({ ...uComponent.data, type: 4 });
            components.push(input);
            break;
          }
          case "SelectMenu": {
            let input = new SelectMenuBuilder({ ...uComponent.data, type: 3 });
            components.push(input);
            break;
          }
        }
      }

      let row = new ActionRowBuilder().addComponents(components);
      rows.push(row);
    };

    modal.addComponents(rows);

    return modal;
  }
  isSelectMenu() { return false; }
  isChatActionCommand() { return false; }
  isUserActionCommand() { return false; }
  isMessageActionCommand() { return false; }
}

module.exports = Modal;
