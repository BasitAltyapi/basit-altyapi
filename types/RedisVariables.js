const _ = require('lodash');
const { createClient } = require("redis");

class RedisVariables {
  constructor () {
    this.redis = createClient({
      url: Underline.config.other.redisURL
    });
    this.redis.connect();
  }

  get type() { return "redis"; }

  async get(path, defVal) {
    let data = await this.redis.json.get("underline", `$.${path}`);
    if (!data) {
      data = defVal;
      await this.redis.json.set("underline", `$.${path}`, defVal);
    }
    return data;
  }

  async set(path, val) {
    return await this.redis.json.set("underline", `$.${path}`, val);
  }

  async unset(path) {
    return await this.redis.json.del("underline", `$.${path}`);
  }
}

module.exports = RedisVariables;