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
    return _.set(object, path, val);
  }

  async unset(path) {
    return _.unset(object, path);
  }

}

module.exports = MemoryVariables;