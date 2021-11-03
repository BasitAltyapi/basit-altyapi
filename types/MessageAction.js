const { ContextMenuInteraction } = require("discord.js");
const Interaction = require("./Interaction");

class MessageAction extends Interaction {

  /** @param {Interaction.TOmittedInteraction & {name: string, onInteraction(interaction: ContextMenuInteraction, other: Interaction.IOther)}} arg */
  constructor (arg = { }) {
    super({
      type: "COMMAND",
      actionType: "MESSAGE",
      ...arg
    })
  }
  isMessageActionCommand() { return true; }
  isSelectMenu() { return false; }
  isButton() { return false; }
  isChatActionCommand() { return false; }
  isUserActionCommand() { return false; }
  toJSON() {}
}

module.exports = MessageAction;
