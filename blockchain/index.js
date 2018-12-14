const {MINER_REWARD_INPUT, MINER_REWARD_AMOUNT} = require("../config");
const {cryptoHash} = require("../util");
const Block = require("./block");
const Transaction = require("../wallet/transaction")
const Wallet = require("../wallet")

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
      console.error("Blockchain Validation Fail: First Block must be Genesis");

      return false;
    }

    for (let i = 1; i < chain.length; i++) {
      const {timestamp, lastHash, hash, data, nonce, difficulty} = chain[i];
      const realLastHash = chain[i - 1].hash;
      const lastDifficulty = chain[i - 1].difficulty;

      if (lastHash !== realLastHash) {
        console.error("Blockchain Validation Fail: Previous Hash must be equal to Hash of previous Block");

        return false;
      }
      const validHash = cryptoHash(timestamp, lastHash, data, nonce, difficulty);

      if (hash !== validHash) {
        console.error("Blockchain Validation Fail: Hash must be valid");

        return false;
      }

      if (Math.abs((lastDifficulty - difficulty)) > 1) {
        console.error("Blockchain Validation Fail: Difficuly adjustment must be in steps of 1");

        return false;
      }
    }
    console.log("Blockchain Valid", chain);

    return true;
  }

  replaceChain(chain, validateTransaction, onSuccess) {
    if (chain.length <= this.chain.length) {
      console.error("Replacement Fail: Chain must be longer than original");

      return;
    }
    if (!Blockchain.isValidChain(chain)) {
      console.error("Replacement Fail: Chain must be valid");

      return;
    }

    if (validateTransaction && !this.isValidTransactionData({chain})) {
      console.error("Replacement Fail: Transaction data must be valid");

      return
    }

    if(onSuccess) {
      onSuccess();
    }

    console.log("Blockchain replaced", chain);

    this.chain = chain;
  }

  isValidTransactionData ({chain}) {
    for (let i = 1; i < chain.length; i++) {
      const block = chain[i];
      const transactionSet = new Set();

      let minerRewardTransactionCount = 0;

      for (let transaction of block.data) {
        if (transaction.input.address == MINER_REWARD_INPUT.address) {
          minerRewardTransactionCount++;

          if(minerRewardTransactionCount > 1) {
            console.error("Transaction Data Validation Fail: Block must have only one miner reward transaction");

            return false;
          }
          if (Object.values(transaction.outputMap)[0] !== MINER_REWARD_AMOUNT) {
            console.error("Transaction Data Validation Fail: Miner reward amount must be exactly", MINER_REWARD_AMOUNT);

            return false;
          }
        } else {
          if (!Transaction.isValidTransaction(transaction)) {
            console.error("Transaction Data Validation Fail: Invalid transaction");

            return false;
          }

          const actualWalletBalance = Wallet.calculateBalance({chain: this.chain, address: transaction.input.address});

          if (transaction.input.amount !== actualWalletBalance) {
            console.error("Transaction Data Validation Fail: Invalid wallet balance");

            return false;
          }

          if (transactionSet.has(transaction)) {
            console.error("Transaction Data Validation Fail: Block must not have duplicate transactions");

            return false;
          } else {
            transactionSet.add(transaction);
          }
        }
      }
    }
    return true;
  }
}

module.exports = Blockchain;
