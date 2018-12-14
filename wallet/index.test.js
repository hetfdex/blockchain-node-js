const Blockchain = require("../blockchain");
const Wallet = require("./index");
const Transaction = require("./transaction");
const {START_BALANCE} = require("../config");
const {verifySignature} = require("../util");

describe("Wallet", () => {
  let wallet;

  beforeEach(() => {
    wallet = new Wallet();
  });

  it("has `balance`", () => {
    expect(wallet).toHaveProperty("balance");
  });

  it("has `publicKey`", () => {
    expect(wallet).toHaveProperty("publicKey");
  });

  describe("Data Signing", () => {
    const data = "test-data";

    it("verifies valid signature", () => {
      expect(verifySignature({
        publicKey: wallet.publicKey,
        data,
        signature: wallet.sign(data)
      })).toBe(true);
    });

    it("doesn't verify invalid signature", () => {
      expect(verifySignature({
        publicKey: wallet.publicKey,
        data,
        signature: new Wallet().sign(data)
      })).toBe(false);
    });
  });

  describe("createTransaction()", () => {
    describe("the `amount` exceeds the balance", () => {
      it("throws an error", () => {
        expect(() => wallet.createTransaction({recipient: "test-recipient", amount: 9999})).toThrow("Creation Fail: Amount exceeds Balance");
      });
    });

    describe("the `amount` is valid", () => {
      let amount, recipient, transaction;

      beforeEach(() => {
        recipient = "test-recipient";
        amount = 100;
        transaction = wallet.createTransaction({recipient, amount});
      });
      it("returns a `Transaction`", () => {
        expect(transaction instanceof Transaction).toBe(true);
      });

      it("`address` matches `publicKey`", () => {
        expect(transaction.input.address).toEqual(wallet.publicKey);
      });

      it("outputs of `recipient` matches `amount`", () => {
        expect(transaction.outputMap[recipient]).toEqual(amount);
      });
    });

    describe("a chain is passed", () => {
      it("calls `Wallet.calculateBalance()`", () => {
        const calculateBalanceMock = jest.fn();
        const originalCalculateBalance = Wallet.calculateBalance;

        Wallet.calculateBalance = calculateBalanceMock;

        wallet.createTransaction({recipient: "test-recipient", amount: 100, chain: new Blockchain().chain});

        expect(calculateBalanceMock).toHaveBeenCalled();

        Wallet.calculateBalance = originalCalculateBalance;
      });
    });
  });

  describe("calculateBalance()", () => {
    let blockchain

    beforeEach(() => {
      blockchain = new Blockchain();
    });

    describe("no outputs for wallet", () => {
      it("returns `START_BALANCE`", () => {
        expect(Wallet.calculateBalance({chain: blockchain.chain, address: wallet.publicKey})).toEqual(START_BALANCE)
      });
    });

    describe("there are outputs for wallet", () => {
      let transactionOne, transactionTwo;

      beforeEach(() => {
        transactionOne = new Wallet().createTransaction({recipient: wallet.publicKey, amount: 100});
        transactionTwo = new Wallet().createTransaction({recipient: wallet.publicKey, amount: 50});

        blockchain.addBlock({data:[transactionOne, transactionTwo]});
      });

      it("adds sum of outputs to wallet balance", () => {
        expect(Wallet.calculateBalance({chain: blockchain.chain, address: wallet.publicKey})).toEqual(START_BALANCE + transactionOne.outputMap[wallet.publicKey] + transactionTwo.outputMap[wallet.publicKey])
      });

      describe("wallet has made transaction", () => {
        let recentTransaction;

        beforeEach(() => {
          recentTransaction = wallet.createTransaction({recipient: "test-recipient", amount: 100});

          blockchain.addBlock({data:[recentTransaction]});
        });

        it("returns output of recent transaction", () => {
          expect(Wallet.calculateBalance({chain: blockchain.chain, address: wallet.publicKey})).toEqual(recentTransaction.outputMap[wallet.publicKey]);
        });

        describe("there are outputs after transaction", () => {
          let sameBlockTransaction, nextBlockTransaction;

          beforeEach(() => {
            recentTransaction = wallet.createTransaction({recipient: "test-recipient", amount: 100});

            sameBlockTransaction = Transaction.getMinerRewardTransaction({minerWallet: wallet});

            blockchain.addBlock({data:[recentTransaction, sameBlockTransaction]});

            nextBlockTransaction = new Wallet().createTransaction({recipient: wallet.publicKey, amount: 100});

            blockchain.addBlock({data:[nextBlockTransaction]});
          });

          it("includes outputs in returned balance", () => {
            expect(Wallet.calculateBalance({chain: blockchain.chain, address: wallet.publicKey})).toEqual(recentTransaction.outputMap[wallet.publicKey] + sameBlockTransaction.outputMap[wallet.publicKey] + nextBlockTransaction.outputMap[wallet.publicKey]);
          });
        });
      });
    });
  });
});
