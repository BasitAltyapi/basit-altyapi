const _ = require('lodash');

class MemoryVariables {
  constructor () {
    this.data = {};
  }

  get type() { return "memory"; }

  async get(path, defVal) {
    return _.get(this.data, path, defVal);
  }

  async set(path, val) {
    return this.data = _.set(this.data, path, val);
  }

  async unset(path) {
    return _.unset(this.data, path);
  }

}

module.exports = MemoryVariables;