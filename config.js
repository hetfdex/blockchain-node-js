const {cryptoHash} = require("./util");

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

const START_BALANCE = 1000;

module.exports = {GENESIS_DATA, MINE_RATE, START_BALANCE};
