const Block = require("./block");
const cryptoHash = require("./crypto-hash");

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
      return false;
    }

    for (let i = 1; i < chain.length; i++) {
      const {timestamp, lastHash, hash, data} = chain[i];
      const realLastHash = chain[i - 1].hash;

      if (lastHash !== realLastHash) {
        return false;
      }

      const validHash = cryptoHash(timestamp, lastHash, data);

      if (hash !== validHash) {
        return false;
      }
    }
    return true;
  }

  replaceChain(chain) {
    if (chain.length <= this.chain.length) {
      return;
    }

    if (!Blockchain.isValidChain(chain)) {
      return;
    }

    this.chain = chain;
  }
}

module.exports = Blockchain;
