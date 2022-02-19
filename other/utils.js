module.exports = {
  async nullDefer(interaction) {
    await interaction.client.api.interactions(interaction.id, interaction.token).callback.post({
      data: {
        type: 6,
        data: {
          flags: null,
        },
      },
    });
    return true;
  }
}