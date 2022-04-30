const { CommandInteraction } = require("discord.js");
const Interaction = require("./Interaction");

class ChatInput extends Interaction {

  /** @param {Interaction.TOmittedInteraction & Interaction.ActionChatCommand} arg */
  constructor (arg = { }) {
    super({
      actionType: "ChatInput",
      ...arg
    })
  }
  isChatActionCommand() { return true; }
  isSelectMenu() { return false; }
  isButton() { return false; }
  isUserActionCommand() { return false; }
  isMessageActionCommand() { return false; }
  isModal() { return false; }
  toJSON() {}
}

module.exports = ChatInput;