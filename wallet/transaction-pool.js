const Blockchain = require("../blockchain");
const Transaction = require("./transaction");

class TransactionPool {
  constructor () {
    this.transactionMap = {};
  }

  setTransactionMap(transactionMap) {
    this.transactionMap = transactionMap;
  }

  setTransaction(transaction) {
    this.transactionMap[transaction.id] = transaction;
  }

  getValidTransactions() {
    return Object.values(this.transactionMap).filter(transaction => Transaction.isValidTransaction(transaction));
  }

  isExistingTransaction({address}) {
    const transactions = Object.values(this.transactionMap);

    return transactions.find(transaction => transaction.input.address === address);
  }

  clearTransactions() {
    this.transactionMap = {};
  }

  clearBlochchainTransactions({chain}) {
    for (let i = 1; i < chain.length; i++) {
      const block = chain[i];

      for (let transaction of block.data) {
        if(this.transactionMap[transaction.id]) {
          delete this.transactionMap[transaction.id];
        }
      };
    };
  }
}

module.exports = TransactionPool;
