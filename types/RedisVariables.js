const _ = require('lodash');
const { createClient } = require("redis");

class RedisVariables {
  constructor () {
    this.redis = createClient({
      url: Underline.config.other.redis.url
    });
    this.redis.connect();
    this.key = Underline.config.other.redis.key;
  }

  get type() { return "redis"; }

  async get(path, defVal) {
    let data = JSON.parse(await this.redis.get(this.key));
    let value = _.get(data, path)
    if (!value) {
      value = defVal;
      await this.set(path, defVal);
    }
    return value;
  }

  async set(path, val) {
    let data = JSON.parse(await this.redis.get(this.key));
    _.set(data, path, val);
    return await this.redis.set(this.key, JSON.stringify(data));
  }

  async unset(path) {
    let data = JSON.parse(await this.redis.get(this.key));
    _.unset(data, path);
    return await this.redis.set(this.key, JSON.stringify(data));
  }
}

module.exports = RedisVariables;