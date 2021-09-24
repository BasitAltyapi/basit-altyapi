const { CommandInteraction } = require("discord.js");
const Interaction = require("./Interaction");

class SlashCommand extends Interaction {

  /** @param {Interaction.TOmittedInteraction & {name: string[], onInteraction(interaction: CommandInteraction, other: Interaction.IOther)}} arg */
  constructor (arg = { }) {
    super({
      actionType: "CHAT_INPUT",
      ...arg
    })
  }
}

module.exports = SlashCommand;
