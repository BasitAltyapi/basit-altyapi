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
    let firstKey = Object.keys(_.set({}, path, 1))[0];
    let redisKey = `${this.key}:${firstKey}`;
    let data = JSON.parse(await this.redis.get(redisKey));
    let value = _.get(data, path)
    if (!value) {
      value = defVal;
      await this.set(path, defVal);
    }
    return value;
  }

  async set(path, val) {
    let firstKey = Object.keys(_.set({}, path, 1))[0];
    let redisKey = `${this.key}:${firstKey}`;
    let data = JSON.parse(await this.redis.get(redisKey));
    data = _.set(data, path, val);
    return await this.redis.set(redisKey, JSON.stringify(data));
  }

  async unset(path) {
    let firstKey = Object.keys(_.set({}, path, 1))[0];
    let redisKey = `${this.key}:${firstKey}`;
    let data = JSON.parse(await this.redis.get(redisKey));
    _.unset(data, path);
    if (typeof data[firstKey] == "undefined") {
      return await this.redis.del(redisKey);
    } else {
      return await this.redis.set(redisKey, JSON.stringify(data));
    }
  }
}

module.exports = RedisVariables;