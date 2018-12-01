const cryptoHash = require("./crypto-hash");

const INITIAL_DIFFICULTY = 3;

const GENESIS_DATA = {
  timestamp: Date.now(),
  lastHash: cryptoHash("genesis-lastHash"),
  hash: cryptoHash("genesis-hash"),
  data: [],
  nonce: 0,
  difficulty: INITIAL_DIFFICULTY
};

module.exports = {GENESIS_DATA};
