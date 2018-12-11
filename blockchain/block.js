const hexToBinary = require("hex-to-binary");
const {cryptoHash} = require("../util");
const {MINE_RATE, GENESIS_DATA} = require("../config");

class Block {
  constructor({timestamp, lastHash, hash, data, nonce, difficulty}) {
    this.timestamp = timestamp;
    this.lastHash = lastHash;
    this.hash = hash;
    this.data = data;
    this.nonce = nonce;
    this.difficulty = difficulty;
  }

  static genesis() {
    return new this(GENESIS_DATA);
  }

  static mineBlock({lastBlock, data}) {
    const lastHash = lastBlock.hash;

    let timestamp, hash;
    let nonce = 0;
    let {difficulty} = lastBlock;

    do {
      nonce++;

      timestamp = Date.now();
      difficulty = Block.adjustDifficulty({block: lastBlock, timestamp});
      hash = cryptoHash(timestamp, lastHash, data, nonce, difficulty);
    } while (hexToBinary(hash).substring(0, difficulty) !== "0".repeat(difficulty));

    return new this({timestamp,lastHash,hash,data,nonce,difficulty});
  }

  static adjustDifficulty({block, timestamp}) {
    const {difficulty} = block;

    if (difficulty < 1) {
      return 1;
    }

    if(timestamp - block.timestamp > MINE_RATE) {
      return difficulty - 1;
    }
    return difficulty + 1;
  }
}

module.exports = Block;
