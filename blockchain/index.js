const {cryptoHash} = require("../util");
const Block = require("./block");

class Blockchain {
  constructor() {
    this.chain = [Block.genesis()];
  }

  addBlock({data}) {
    const block = Block.mineBlock({
      lastBlock: this.chain[this.chain.length - 1],
      data
    });
    this.chain.push(block);
  }

  static isValidChain(chain) {
    if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
      console.error("Validation Fail: First Block must be Genesis");

      return false;
    }

    for (let i = 1; i < chain.length; i++) {
      const {timestamp, lastHash, hash, data, nonce, difficulty} = chain[i];
      const realLastHash = chain[i - 1].hash;
      const lastDifficulty = chain[i - 1].difficulty;

      if (lastHash !== realLastHash) {
        console.error("Validation Fail: Previous Hash must be equal to Hash of previous Block");

        return false;
      }
      const validHash = cryptoHash(timestamp, lastHash, data, nonce, difficulty);

      if (hash !== validHash) {
        console.error("Validation Fail: Hash must be valid");

        return false;
      }

      if (Math.abs((lastDifficulty - difficulty)) > 1) {
        console.error("Validation Fail: Difficuly adjustment must be in steps of 1");

        return false;
      }
    }
    console.log("Blockchain valid", chain);

    return true;
  }

  replaceChain(chain) {
    if (chain.length <= this.chain.length) {
      console.error("Replacement Fail: Chain must be longer than original");

      return;
    }
    if (!Blockchain.isValidChain(chain)) {
      console.error("Replacement Fail: Chain must be valid");

      return;
    }
    console.log("Blockchain replaced", chain);

    this.chain = chain;
  }
}

module.exports = Blockchain;
