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
}

module.exports = Button;
