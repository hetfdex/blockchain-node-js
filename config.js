const {cryptoHash} = require("./util");

const INITIAL_DIFFICULTY = 10;
const MINE_RATE = 10;
const START_BALANCE = 1000;
const MINER_REWARD_AMOUNT = 50;

const GENESIS_DATA = {
  timestamp: 0,
  lastHash: cryptoHash("genesis-lastHash"),
  hash: cryptoHash("genesis-hash"),
  data: [],
  nonce: 0,
  difficulty: INITIAL_DIFFICULTY
};

const MINER_REWARD_INPUT = {address: "miner-reward"};

module.exports = {MINE_RATE, START_BALANCE, MINER_REWARD_AMOUNT, GENESIS_DATA, MINER_REWARD_INPUT};
