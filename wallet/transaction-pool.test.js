const TransactionPool = require("./transaction-pool");
const Blockchain = require("../blockchain");
const Transaction = require("./transaction");
const Wallet = require("./index");

describe("TransactionPool", () => {
  let transactionPool, transaction, senderWallet, errorMock, logMock;

  beforeEach(() => {
    transactionPool = new TransactionPool();
    senderWallet = new Wallet();
    transaction = new Transaction({senderWallet, recipient: "test-recipient", amount: 100});

    errorMock = jest.fn();
    logMock = jest.fn();

    global.console.error = errorMock;
    global.console.log = logMock;
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

  describe("getValidTransactions()", () => {
    let validTransactions;

    beforeEach(() => {
      validTransactions = [];

      for (let i = 0; i < 10; i++) {
        transaction = new Transaction({senderWallet, recipient: "test-recipient", amount: 50});

        if(i % 3 === 0) {
          transaction.input.amount = 9999;
        } else if(i % 3 === 1) {
          transaction.input.signature = new Wallet().sign("fake-wallet");
        } else {
          validTransactions.push(transaction);
        }
        transactionPool.setTransaction(transaction);
      }
    });

    it("return valid transactions", () => {
      expect(transactionPool.getValidTransactions()).toEqual(validTransactions);
    });

    it("logs error for invalid transactions", () => {
      transactionPool.getValidTransactions();

      expect(errorMock).toHaveBeenCalled();
    });
  });

  describe("clearTransactions()", () => {
    it("clears transactions", () => {
      transactionPool.clearTransactions();

      expect(transactionPool.transactionMap).toEqual({});
    });
  });

  describe("clearBlochchainTransactions()", () => {
    it("clears existing blockchain transactions", () => {
      const blockchain = new Blockchain();
      const expectedTransactionMap = {};

      for (let i = 0; i < 6; i++) {
        const transaction = new Wallet().createTransaction({recipient: "test-recipient", amount: 50});

        transactionPool.setTransaction(transaction);

        if(i % 2 === 0) {
          blockchain.addBlock({data: [transaction]})
        } else {
          expectedTransactionMap[transaction.id] = transaction;
        }
      }
      transactionPool.clearBlochchainTransactions({chain: blockchain.chain});

      expect(transactionPool.transactionMap).toEqual(expectedTransactionMap);
    });
  });
});
