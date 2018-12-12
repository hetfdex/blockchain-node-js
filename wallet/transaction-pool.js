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

  isExistingTransaction({address}) {
    const transactions = Object.values(this.transactionMap);

    return transactions.find(transaction => transaction.input.address === address);
  }
}

module.exports = TransactionPool;
