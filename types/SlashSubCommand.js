const { CommandInteraction } = require("discord.js");
const Interaction = require("./Interaction");

class SlashSubCommand extends Interaction {

  /** @param {Interaction.TOmittedInteraction & {name: string, subName: string, onInteraction(interaction: CommandInteraction, other: Interaction.IOther)}} arg */
  constructor (arg = { }) {
    super({
      type: "SUB_COMMAND",
      actionType: "CHAT_INPUT",
      ...arg
    })
  }
}

module.exports = SlashSubCommand;
