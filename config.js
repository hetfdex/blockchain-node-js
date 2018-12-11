const cryptoHash = require("./util/crypto-hash");

const INITIAL_DIFFICULTY = 10;
const MINE_RATE = 10;

const GENESIS_DATA = {
  timestamp: Date.now(),
  lastHash: cryptoHash("genesis-lastHash"),
  hash: cryptoHash("genesis-hash"),
  data: [],
  nonce: 0,
  difficulty: INITIAL_DIFFICULTY
};

module.exports = {GENESIS_DATA, MINE_RATE};
