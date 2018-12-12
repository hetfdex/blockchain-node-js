const TransactionPool = require("./transaction-pool");
const Transaction = require("./transaction");
const Wallet = require("./index");

describe("TransactionPool", () => {
  let transactionPool, transaction, senderWallet;

  beforeEach(() => {
    transactionPool = new TransactionPool();
    senderWallet = new Wallet();
    transaction = new Transaction({senderWallet, recipient: "test-recipient", amount: 100});
  });

  describe("setTransaction()", () => {
    it("adds transaction", () => {
      transactionPool.setTransaction(transaction);

      expect(transactionPool.transactionMap[transaction.id]).toBe(transaction);
    });
  });

  describe("isExistingTransaction()", () => {
    it("return an existing transaction", () => {
      transactionPool.setTransaction(transaction);

      expect(transactionPool.isExistingTransaction({address: senderWallet.publicKey})).toBe(transaction);
    });
  });
});
