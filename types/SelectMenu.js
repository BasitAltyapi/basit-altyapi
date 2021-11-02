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
}

module.exports = SelectMenu;

