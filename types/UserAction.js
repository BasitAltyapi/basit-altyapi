const { ContextMenuInteraction } = require("discord.js");
const Interaction = require("./Interaction");

class MessageAction extends Interaction {

  /** @param {Interaction.TOmittedInteraction & {name: string, onInteraction(interaction: ContextMenuInteraction, other: Interaction.IOther)}} arg */
  constructor (arg = { }) {
    super({
      type: "COMMAND",
      actionType: "USER",
      name: [arg.name],
      ...arg
    })
  }
}

module.exports = MessageAction;
