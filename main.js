require("./other/patchConsoleLog");

const Cluster = require('discord-hybrid-sharding');
const config = require("./config");

if (config.sharding.enabled) {
  const manager = new Cluster.Manager(`${__dirname}/index.js`, {
    totalShards: config.sharding.count[0],
    shardsPerClusters: config.sharding.count[1],
    mode: 'process',
    token: config.clientToken,
    respawn: true,
    execArgv: ["--expose-gc"],
    keepAlive: {
      interval: 5000,
      maxMissedHeartbeats: 12
    }
  });
  config.sharding.onManager(manager);
} else {
  require("./index.js");
}
