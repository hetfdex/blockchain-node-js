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
});
