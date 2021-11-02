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
}

module.exports = SlashCommand;