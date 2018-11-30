const cryptoHash = require("./crypto-hash");

const GENESIS_DATA = {
  timestamp: Date.now(),
  lastHash: cryptoHash("genesis-lastHash"),
  hash: cryptoHash("genesis-hash"),
  data: []
};

module.exports = {GENESIS_DATA};
