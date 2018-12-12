const {verifySignature} = require("../util");
const Wallet = require("./index");
const Transaction = require("./transaction");

describe("Transaction", () => {
  let senderWallet, recipient, amount, transaction, errorMock, logMock;

  beforeEach(() => {
    senderWallet = new Wallet();
    recipient = "test-recipient";
    amount = 100;

    transaction = new Transaction({senderWallet, recipient, amount});

    errorMock = jest.fn();
    logMock = jest.fn();

    global.console.error = errorMock;
    global.console.log = logMock;
  });

  it("has `id`", () => {
    expect(transaction).toHaveProperty("id");
  });

  describe("outputMap", () => {
    it("has `outputMap`", () => {
      expect(transaction).toHaveProperty("outputMap");
    });

    it("outputs the amount to the recipient", () => {
      expect(transaction.outputMap[recipient]).toEqual(amount);
    });

    it("outputs remaining amount back to sender", () => {
      expect(transaction.outputMap[senderWallet.publicKey]).toEqual(senderWallet.balance - amount);
    });
  });

  describe("input", () => {
    it("has `input`", () => {
      expect(transaction).toHaveProperty("input");
    });

    it("contains `timestamp`", () => {
      expect(transaction.input).toHaveProperty("timestamp");
    });

    it("contains `senderWallet`'s publicKey as `address`", () => {
      expect(transaction.input.address).toEqual(senderWallet.publicKey);
    });

    it("contains `senderWallet`'s balance as `amount`", () => {
      expect(transaction.input.amount).toEqual(senderWallet.balance);
    });

    it("is signed", () => {
      expect(verifySignature({
        publicKey: senderWallet.publicKey,
        data: transaction.outputMap,
        signature: transaction.input.signature
      })).toBe(true);
    });
  });

  describe("validTransaction()", () => {
    describe("`transaction` is valid", () => {
      it("returns true and logs validation", () => {
        expect(Transaction.isValidTransaction(transaction)).toBe(true);
        expect(logMock).toHaveBeenCalled();
      });
    });

    describe("`transaction` is invalid", () => {
      describe("`transaction` `outputMap` is invalid", () => {
        it("returns false and logs an error", () => {
          transaction.outputMap[senderWallet.publicKey] = 9999;

          expect(Transaction.isValidTransaction(transaction)).toBe(false);
          expect(errorMock).toHaveBeenCalled();
        });
      });

      describe("`transaction` `input` `signature` is invalid", () => {
        it("returns false and logs an error", () => {
          transaction.input.signature = new Wallet().sign("fake-data");

          expect(Transaction.isValidTransaction(transaction)).toBe(false);
          expect(errorMock).toHaveBeenCalled();
        });
      });
    });
  });

  describe("update()", () => {
    describe("amount is invalid", () => {
      it("throws an error", () => {
        expect(() => {transaction.update({senderWallet, recipient: "next-recipient", amount: 9999})}).toThrow("Update Fail: Amount exceeds Balance");
      });
    });

    describe("amount is valid", () => {
      let originalSignature, originalSenderOutput, nextRecipient, nextAmount;

      beforeEach(() => {
        originalSignature = transaction.input.signature;
        originalSenderOutput = transaction.outputMap[senderWallet.publicKey];
        nextRecipient = "next-recipient";
        nextAmount = 50;

        transaction.update({senderWallet, recipient: nextRecipient, amount: nextAmount});
      });

      it("contains correct `amount` on `recipient` output", () => {
        expect(transaction.outputMap[nextRecipient]).toEqual(nextAmount);
      });

      it("subtracts correct `amount` from sender output", () => {
        expect(transaction.outputMap[senderWallet.publicKey]).toEqual(originalSenderOutput - nextAmount);
      });

      it("maintains a total output that matches `input` `amount`", () => {
        expect(Object.values(transaction.outputMap).reduce((total, outputAmount) => total + outputAmount)).toEqual(transaction.input.amount);
      });

      it("re-signs the transaction", () => {
        expect(transaction.input.signature).not.toEqual(originalSignature);
      });

      describe("another update for the same recipient", () => {
        let addedAmount;

        beforeEach(() => {
          addedAmount = 50;

          transaction.update({senderWallet, recipient: nextRecipient, amount: addedAmount});
        });

        it("adds to recipient `amount`", () => {
          expect(transaction.outputMap[nextRecipient]).toEqual(nextAmount + addedAmount);
        });

        it("subtracts the `amount` from sender output", () => {
          expect(transaction.outputMap[senderWallet.publicKey]).toEqual(originalSenderOutput - nextAmount - addedAmount);
        });
      });
    });
  });
});
