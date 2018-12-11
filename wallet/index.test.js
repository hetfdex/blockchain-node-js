const Wallet = require("./index");
const Transaction = require("./transaction");
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
  });
});
