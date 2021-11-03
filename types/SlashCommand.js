const { CommandInteraction } = require("discord.js");
const Interaction = require("./Interaction");

class SlashCommand extends Interaction {

  /** @param {Interaction.TOmittedInteraction & Interaction.ActionChatCommand} arg */
  constructor (arg = { }) {
    super({
      actionType: "CHAT_INPUT",
      ...arg
    })
  }
  isChatActionCommand() { return true; }
  isSelectMenu() { return false; }
  isButton() { return false; }
  isUserActionCommand() { return false; }
  isMessageActionCommand() { return false; }
  toJSON() {}
}

module.exports = SlashCommand;