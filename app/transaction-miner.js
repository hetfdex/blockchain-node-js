const Blockchain = require("../blockchain");
const Transaction = require("../wallet/transaction");

class TransactionMiner {
  constructor({blockchain, transactionPool, wallet, pubsub}) {
    this.blockchain = blockchain;
    this.transactionPool = transactionPool;
    this.wallet = wallet;
    this.pubsub = pubsub;
  }

  mineTransactions() {
    const validTransactions = this.transactionPool.getValidTransactions();

    validTransactions.push(Transaction.getMinerRewardTransaction ({minerWallet: this.wallet}));

    this.blockchain.addBlock({data: validTransactions});

    this.pubsub.broadcastChain();

    this.transactionPool.clearTransactions();
  }
}

module.exports = TransactionMiner;
