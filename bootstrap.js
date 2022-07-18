require("./other/patchConsoleLog");

const Discord = require('discord.js');
const config = require("./config");

if (config.sharding.enabled) {
  const manager = new Discord.ShardingManager(
    "./index.js",
    {
      mode: "process",
      respawn: true,
      totalShards: config.sharding.count,
      token: config.clientToken,
      execArgv: ["--expose-gc"]
    }
  );
  config.sharding.onManager(manager);
} else {
  require("./index.js");
}