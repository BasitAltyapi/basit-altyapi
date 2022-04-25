const Interaction = require("./Interaction");

class MessageAction extends Interaction {

  /** @param {Interaction.TOmittedInteraction & Interaction.ActionRightClickCommand} arg */
  constructor (arg = { }) {
    super({
      type: "COMMAND",
      actionType: "User",
      ...arg
    })
  }
  isUserActionCommand() { return true; }
  isSelectMenu() { return false; }
  isButton() { return false; }
  isChatActionCommand() { return false; }
  isMessageActionCommand() { return false; }
  toJSON() {}
}

module.exports = MessageAction;
