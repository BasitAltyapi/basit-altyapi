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
  },
  /**
   * @param {string[]} names 
   * @param {{[key: string]: string[]}} obj 
   * @param {string[]?} start 
   * @param {number?} depth 
   * @returns {string[]}
   */
  sortDependant(names, obj, start=[], depth = 0) {
    const processed = names.reduce((a, b, i) => {
      if (obj[b].every(Array.prototype.includes, a)) a.push(b)
      return a
    }, start)
    const nextNames = names.filter(n => !processed.includes(n)),
      goAgain = nextNames.length && depth <= names.length
    return goAgain ? this.sortDependant(nextNames, obj, processed, depth + 1) : processed
  }
}